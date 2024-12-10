import React, { useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const Posts = () => {
  const [query, setQuery] = useState("");
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [newComment, setNewComment] = useState({});
  const queryClient = useQueryClient();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get("http://127.0.0.1:8000/api/v1/posts", {
      params: { page: pageParam, query },
      headers: getAuthHeaders(),
    });
    console.log(response.data);
    return response.data;
  };

  const {
    data,
    isError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", query],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) =>
      lastPage.data.next_page_url ? lastPage.data.current_page + 1 : undefined,
  });

  const { mutate: createPost } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/posts",
        newPost,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    },
    onSuccess: () => {
      setNewPost({ title: "", body: "" });
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  const { mutate: addComment } = useMutation({
    mutationFn: async (postId) => {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/posts/${postId}/comments`,
        { body: newComment[postId] },
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    },
    onMutate: (postId) => {
      queryClient.setQueryData(["posts", query], (oldData) => {
        if (!oldData) return;

        const newCommentData = {
          body: newComment[postId],
          post_id: postId,
          created_at: new Date().toISOString(),
        };

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: Array.isArray(page.data)
              ? page.data.map((post) =>
                  post.id === postId
                    ? {
                        ...post,
                        comments: [newCommentData, ...(post.comments || [])],
                      }
                    : post
                )
              : page.data,
          })),
        };
      });
    },
    onSuccess: (newCommentData) => {
      queryClient.invalidateQueries(["posts", query]);

      queryClient.setQueryData(["posts", query], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: Array.isArray(page.data)
              ? page.data.map((post) =>
                  post.id === newCommentData.post_id
                    ? {
                        ...post,
                        comments: [
                          newCommentData,
                          ...(post.comments || []).sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          ),
                        ],
                      }
                    : post
                )
              : page.data,
          })),
        };
      });

      setNewComment((prev) => ({ ...prev, [newCommentData.post_id]: "" }));
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
    },
  });

  const loadMorePosts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const searchPosts = () => {
    setQuery("");
    queryClient.invalidateQueries(["posts"]);
  };

  const resetSearch = () => {
    setQuery("");
    queryClient.invalidateQueries(["posts"]);
  };

  const allPosts = data ? data.pages.flatMap((page) => page.data.data) : [];

  return (
    <div className="bg-white relative flex flex-col items-center h-full w-full">
      <h1 className="font-poppins font-bold text-3xl text-black py-8">
        Posts and Comments
      </h1>

      {isError && (
        <div className="text-red-500 text-center mb-4">
          Failed to fetch posts.
        </div>
      )}
      {isLoading && <div className="text-center mb-4">Loading...</div>}

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
            onClick={() => createPost()}
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
        <div className="bg-gray-300 p-6 rounded-md w-full max-w-5xl">
          <h2 className="text-black text-2xl mb-4 text-center">All Posts</h2>
          <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<h4>Loading more posts...</h4>}
            endMessage={<p>No more posts available.</p>}
          >
            {allPosts.length > 0 ? (
              allPosts.map((post) => (
                <div key={post.id} className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="mb-4 text-gray-700">{post.body}</p>

                  {/* Display Comments */}
                  <div className="mt-4 bg-gray-100 rounded-md p-4 shadow-md">
                    <h4 className="font-bold text-lg mb-3">Comments</h4>
                    <div
                      className="overflow-y-auto max-h-60 p-4 rounded-md bg-white"
                      style={{ maxHeight: "200px" }}
                    >
                      {post.comments && post.comments.length > 0 ? (
                        <ul className="space-y-2">
                          {post.comments.map((comment) => (
                            <li
                              key={comment.id}
                              className="text-sm text-gray-600"
                            >
                              {comment.body}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No comments yet.
                        </p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="mt-4">
                      <textarea
                        className="px-4 py-2 rounded-md w-full border border-gray-300"
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
                        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => addComment(post.id)}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No posts available.
              </p>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Posts;
