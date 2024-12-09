import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/posts?page=${page}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const postsData = response.data.data.data;
      if (Array.isArray(postsData)) {
        setPosts((prevPosts) => {
          const uniquePosts = postsData.filter(
            (newPost) => !prevPosts.some((post) => post.id === newPost.id)
          );
          return [...prevPosts, ...uniquePosts];
        });

        setHasMore(postsData.length > 0);
      } else {
        console.error("Expected an array, but got", postsData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts.");
    }
  };

  const loadMorePosts = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/posts",
        newPost,
        {
          headers: getAuthHeaders(),
        }
      );
      setNewPost({ title: "", body: "" });
      fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Failed to create post.");
    }
  };

  const searchPosts = async () => {
    setError(null);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/posts/search",
        {
          params: { query },
          headers: getAuthHeaders(),
        }
      );
      if (Array.isArray(response.data.data)) {
        setPosts(response.data.data);
        setError(null);
      } else {
        console.error(
          "Expected an array of posts, but received:",
          response.data
        );
        setPosts([]);
      }
    } catch (err) {
      setPosts([]);
    }
  };

  const resetSearch = () => {
    setQuery("");
    fetchPosts();
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/posts/${postId}/comments`,
        { body: newComment[postId] },
        {
          headers: getAuthHeaders(),
        }
      );
      setNewComment({ ...newComment, [postId]: "" });
      fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Failed to add comment.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <div className="bg-white relative flex flex-col items-center h-full w-full">
      <h1 className="font-poppins font-bold text-3xl text-black py-8">
        Posts and Comments
      </h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="flex flex-col items-center gap-5 w-full">
        {/* Create Post Section */}
        <div className="bg-blue-500 relative flex flex-col items-start gap-6 p-8 w-full max-w-5xl rounded-md font-poppins">
          <h2 className="text-white text-2xl mb-4">Create a New Post</h2>
          <input
            className="px-4 py-2 rounded-md w-full"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            className="px-4 py-2 rounded-md w-full"
            placeholder="Body"
            value={newPost.body}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, body: e.target.value }))
            }
          />
          <button
            className="bg-green-500 px-4 py-2 rounded-md"
            onClick={createPost}
          >
            Submit
          </button>
        </div>

        {/* Search Posts Section */}
        <div className="bg-gray-200 p-6 rounded-md w-full max-w-5xl">
          <h2 className="text-black text-2xl mb-4">Search Posts</h2>
          <input
            className="px-4 py-2 rounded-md w-full"
            placeholder="Search by title or body"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              className="bg-blue-500 px-4 py-2 mt-2 rounded-md"
              onClick={searchPosts}
            >
              Search
            </button>
            {/* Reset Button */}
            <button
              className="bg-red-500 px-4 py-2 mt-2 rounded-md"
              onClick={resetSearch}
            >
              Reset Search
            </button>
          </div>
        </div>

        {/* Display Posts with Infinite Scroll */}
        <div className="bg-gray-100 p-6 rounded-md w-full max-w-5xl">
          <h2 className="text-black text-2xl mb-4">All Posts</h2>

          <InfiniteScroll
            dataLength={posts.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more posts to load.</p>}
          >
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="mb-6">
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>

                  {/* Display Comments */}
                  <div className="mt-4">
                    <h4 className="font-bold text-xl">Comments</h4>
                    {post.comments && post.comments.length > 0 ? (
                      <ul>
                        {post.comments.map((comment) => (
                          <li key={comment.id} className="mt-2">
                            <p>{comment.body}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No comments yet.</p>
                    )}

                    {/* Add Comment */}
                    <div className="mt-4">
                      <textarea
                        className="px-4 py-2 rounded-md w-full"
                        placeholder="Add a comment"
                        value={newComment[post.id] || ""}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            [post.id]: e.target.value,
                          })
                        }
                      />
                      <button
                        className="bg-blue-500 px-4 py-2 mt-2 rounded-md"
                        onClick={() => handleCommentSubmit(post.id)}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Posts;
