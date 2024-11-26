import React, { useEffect, useState } from "react";
import axios from "../../utils/Axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentVisibility, setCommentVisibility] = useState({});
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [newComment, setNewComment] = useState({ body: "", postId: null });
  const [navigate, setNavigate] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/posts");
        setPosts(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching posts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setNavigate]);

  const toggleComments = (postId, commentsLength) => {
    setCommentVisibility((prev) => ({
      ...prev,
      [postId]: prev[postId] === commentsLength ? 1 : commentsLength,
    }));
  };

  const handleNewPostSubmit = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/posts",
        newPost
      );
      setPosts([response.data.data, ...posts]);
      setNewPost({ title: "", body: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create a new post.");
    }
  };

  const handleNewCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/posts/${postId}/comments`,
        { body: newComment.body }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data.data] }
            : post
        )
      );
      setNewComment({ body: "", postId: null });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add a comment.");
    }
  };

  const renderComments = (comments = [], postId) => {
    const visibleCount = commentVisibility[postId] || 1;
    const visibleComments = comments.slice(0, visibleCount);

    return (
      <>
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start space-x-4 border-t border-gray-200 pt-4"
          >
            <div>
              <div className="flex items-center space-x-2">
                <strong>{comment.user?.name || "Anonymous"}</strong>
              </div>
              <p className="text-gray-800">{comment.body}</p>
              <div className="flex space-x-4 mt-2 text-sm text-blue-600">
                <button className="hover:underline">Like</button>
                <button className="hover:underline">Reply</button>
              </div>
            </div>
          </div>
        ))}
        {comments.length > 10 && (
          <button
            onClick={() => toggleComments(postId, comments.length)}
            className="text-blue-500 hover:underline mt-4"
          >
            {visibleCount === 10 ? "Show More Comments" : "Show Less Comments"}
          </button>
        )}
      </>
    );
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-2xl font-bold flex justify-center text-gray-800 mb-6">
        Posts
      </h1>

      {/* Create Post */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between">
          <input></input>
        </div>
        <h2 className="text-lg font-bold mb-4">Create New Post</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 mb-4"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Body"
          className="w-full border p-2 mb-4"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <button
          onClick={handleNewPostSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
              <p className="text-gray-700 mt-2">{post.body}</p>
              <h3 className="text-lg font-semibold mt-4">Comments:</h3>
              <div className="mt-2 space-y-4">
                {post.comments?.length > 0 ? (
                  renderComments(post.comments, post.id)
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="mt-4">
                <textarea
                  placeholder="Write a comment..."
                  className="w-full border p-2 mb-2"
                  value={newComment.postId === post.id ? newComment.body : ""}
                  onChange={(e) =>
                    setNewComment({ body: e.target.value, postId: post.id })
                  }
                />
                <button
                  onClick={() => handleNewCommentSubmit(post.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg flex justify-center py-10 w-full">
          <h1 className="text-[#BBBBBB] text-xs md:text-md lg:text-2xl">
            No Posts Found!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Posts;
