import React, { useEffect, useState } from "react";
import axios from "../../utils/Axios";

const List = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentVisibility, setCommentVisibility] = useState({});
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

  const renderComments = (comments, postId) => {
    const visibleCount = commentVisibility[postId] || 1;
    const visibleComments = comments.slice(0, visibleCount);

    return (
      <>
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start space-x-4 border-t border-gray-200 pt-4"
          >
            {/* <img
              src={comment.user?.avatar || "https://via.placeholder.com/40"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            /> */}
            <div>
              <div className="flex items-center space-x-2">
                <strong>{comment.user?.name || "Anonymous"}</strong>
                {/* <span className="text-gray-500 text-sm">
                  {comment.created_at}
                </span> */}
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
                {post.comments.length > 0 ? (
                  renderComments(post.comments, post.id)
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
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

export default List;
