import React, { useEffect, useState } from "react";
import axios from "axios";

const List = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-slate-700 relative flex flex-col items-center p-6 h-screen w-full">
      <h1 className="font-poppins font-bold text-3xl text-white py-8">Posts</h1>
      {posts.length > 0 ? (
        <ul className="bg-slate-500 w-full pt-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="mb-4 p-4 border border-gray-300 rounded-md"
            >
              <h2 className="text-xl font-bold text-white">{post.title}</h2>
              <p>{post.body}</p>

              <h3 className="mt-2">Comments:</h3>
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-gray-200 p-2 mb-2 rounded-md text-white"
                  >
                    <strong>{comment.user?.name || "User"}:</strong>{" "}
                    {comment.body}
                  </div>
                ))
              ) : (
                <p>No comments available.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default List;
