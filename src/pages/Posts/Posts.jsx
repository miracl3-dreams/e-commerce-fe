import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Cards from "../../components/Cards";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import axios from "../../utils/Axios";

const PostsAndComments = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({}); // Store comments by postId
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({ title: "", body: "" });
  const [commentFormData, setCommentFormData] = useState({}); // Track comment form data for each post
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState({}); // Track show/hide state for comments
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  useEffect(() => {
    fetchPosts(page);
  }, []);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  const fetchPosts = async (pageNumber) => {
    setLoadingPosts(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/posts?page=${pageNumber}`,
        getAuthHeaders()
      );

      const newPosts = response.data?.data || [];

      setPosts((prevPosts) => {
        const uniquePosts = [
          ...newPosts.filter(
            (newPost) => !prevPosts.some((post) => post.id === newPost.id)
          ),
          ...prevPosts, // Prepend the new posts at the beginning of the array
        ];
        return uniquePosts;
      });

      // Load comments for the newly fetched posts
      newPosts.forEach((post) => {
        if (!comments[post.id]) {
          fetchComments(post.id); // Fetch comments for each post if they don't exist
        }
      });

      if (newPosts.length === 0 || newPosts.length < 10) {
        setHasMorePosts(false);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchComments = async (postId) => {
    setLoadingComments(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/posts/${postId}/comments`,
        getAuthHeaders()
      );

      // Only update with new comments that are not already in the state
      const newComments = response.data?.data || [];
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: newComments, // Replace the old comments with the new ones
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/v1/posts",
        postFormData,
        getAuthHeaders()
      );
      setPostFormData({ title: "", body: "" });
      setIsPostModalOpen(false);
      fetchPosts(1); // Fetch posts again after creating a new post
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCreateComment = async (postId) => {
    if (!commentFormData[postId] || !commentFormData[postId].comment) {
      console.error("Comment body is required.");
      return;
    }

    try {
      await axios.post(
        `/api/v1/posts/${postId}/comments`,
        { body: commentFormData[postId].comment },
        getAuthHeaders()
      );

      // Reset comment form data for the post
      setCommentFormData((prevData) => ({
        ...prevData,
        [postId]: { comment: "" },
      }));

      // Re-fetch comments for the post after adding the new comment
      fetchComments(postId);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleToggleComments = async (postId) => {
    setShowAllComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

    if (
      !showAllComments[postId] &&
      (!comments[postId] || comments[postId].length === 0)
    ) {
      await fetchComments(postId);
    }
  };
  useEffect(() => {
    document.title = "Posts and Comments - Task Management";
  }, []);

  return (
    <div className="bg-white relative flex flex-col items-center h-full w-full">
      <h1 className="font-poppins font-bold text-3xl text-black py-8">
        Posts and Comments
      </h1>

      <div className="flex justify-center w-full mb-4">
        <Cards className="bg-blue-500 flex w-full justify-center">
          <Button
            className="bg-green-500 px-6 py-3 rounded-md"
            onClick={() => setIsPostModalOpen(true)}
          >
            Create Post
          </Button>
        </Cards>
      </div>

      <div className="w-full max-w-5xl">
        <h2 className="font-poppins text-2xl text-black py-4 flex justify-center">
          Posts
        </h2>
        <InfiniteScroll
          dataLength={posts.length}
          next={() => fetchPosts(page)}
          hasMore={hasMorePosts}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p className="flex items-center justify-center">
              No more posts available.
            </p>
          }
        >
          {loadingPosts ? (
            <Cards className="bg-blue-500 flex justify-center">
              <p>Loading posts...</p>
            </Cards>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="bg-blue-300 p-4 rounded-md mb-4"
              >
                <h3 className="font-bold">{post.title}</h3>
                <p>{post.body}</p>
                <div className="w-full mt-4 max-h-72 overflow-y-auto">
                  {loadingComments ? (
                    <Cards className="bg-blue-500 flex justify-center">
                      <p>Loading comments...</p>
                    </Cards>
                  ) : (
                    (comments[post.id] || [])
                      .slice(0, showAllComments[post.id] ? undefined : 5)
                      .map((comment, index) => (
                        <div
                          key={`${post.id}-${comment.id}-${index}`}
                          className="flex bg-gray-200 p-3 rounded-md mb-3"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {comment.username || "Anonymous"}
                            </h4>
                            <p>{comment.body}</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                {comments[post.id]?.length > 5 && (
                  <button
                    className="text-blue-700 mt-2"
                    onClick={() => handleToggleComments(post.id)}
                  >
                    {showAllComments[post.id] ? "Show Less" : "Show More"}
                  </button>
                )}
                {/* Comment Form */}
                <div className="flex items-center mt-4 w-full">
                  <textarea
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a comment..."
                    value={commentFormData[post.id]?.comment || ""}
                    onChange={(e) =>
                      setCommentFormData({
                        ...commentFormData,
                        [post.id]: { comment: e.target.value },
                      })
                    }
                  />
                  <Button
                    className="bg-green-500 px-4 py-2 rounded-md ml-3"
                    onClick={() => handleCreateComment(post.id)}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <Cards className="bg-blue-500 flex justify-center">
              <p>No posts available.</p>
            </Cards>
          )}
        </InfiniteScroll>
      </div>

      {/* Modal for creating a post */}
      <Modal isOpen={isPostModalOpen} className="bg-slate-300">
        <h2 className="font-poppins font-bold text-xl">Create Post</h2>
        <input
          className="w-full px-4 py-2 border rounded-md my-3"
          type="text"
          placeholder="Title"
          value={postFormData.title}
          onChange={(e) =>
            setPostFormData({ ...postFormData, title: e.target.value })
          }
        />
        <textarea
          className="w-full px-4 py-2 border rounded-md my-3"
          placeholder="Body"
          value={postFormData.body}
          onChange={(e) =>
            setPostFormData({ ...postFormData, body: e.target.value })
          }
        />
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded-md my-3"
          onClick={handleCreatePost}
        >
          Create Post
        </Button>
        <Button
          className="bg-red-500 text-white px-4 py-2 rounded-md my-3"
          onClick={() => setIsPostModalOpen(false)}
        >
          Close
        </Button>
      </Modal>
    </div>
  );
};

export default PostsAndComments;
