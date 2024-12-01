import React, { useState, useEffect } from "react";
import Cards from "../../components/Cards";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import axios from "../../utils/Axios";

const PostsAndComments = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({ title: "", body: "" });
  const [commentFormData, setCommentFormData] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await axios.get(`/api/v1/posts`, getAuthHeaders());
      setPosts(response.data?.data || []);
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
        `/api/v1/posts/${postId}/comments`,
        getAuthHeaders()
      );
      setComments((prev) => {
        const updatedComments = Array.isArray(prev) ? prev : [];
        return [
          ...updatedComments.filter((comment) => comment.post_id !== postId),
          ...(response.data?.data || []),
        ];
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      await axios.post("/api/v1/posts", postFormData, getAuthHeaders());
      setPostFormData({ title: "", body: "" });
      setIsPostModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
    }
  };

  const handleCreateComment = async (postId) => {
    if (!commentFormData.comment) {
      console.error("Comment body is required.");
      return;
    }

    try {
      await axios.post(
        `/api/v1/posts/${postId}/comments`,
        { body: commentFormData.comment },
        getAuthHeaders()
      );
      setCommentFormData({});
      fetchComments(postId);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleShowCommentForm = (postId) => {
    setCommentFormData((prev) => ({ ...prev, post_id: postId }));
  };

  const handleToggleComments = (postId) => {
    setShowAllComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
        {loadingPosts ? (
          <Cards className="bg-blue-500 flex justify-center">
            <p>Loading posts...</p>
          </Cards>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-blue-300 p-4 rounded-md mb-4">
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.body}</p>
              <div className="flex justify-start">
                <Button
                  className="bg-blue-500 px-4 py-2 rounded-md mt-4"
                  onClick={() => handleShowCommentForm(post.id)}
                >
                  Write a comment
                </Button>
              </div>
              <div className="w-full mt-4">
                {loadingComments ? (
                  <Cards className="bg-blue-500 flex justify-center">
                    <p>Loading comments...</p>
                  </Cards>
                ) : (
                  comments
                    .filter((comment) => comment.post_id === post.id)
                    .slice(0, showAllComments[post.id] ? undefined : 1)
                    .map((comment) => (
                      <div
                        key={`${post.id}-${comment.id}`}
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
              {comments.filter((comment) => comment.post_id === post.id)
                .length > 5 && (
                <button
                  className="text-blue-700 mt-2"
                  onClick={() => handleToggleComments(post.id)}
                >
                  {showAllComments[post.id] ? "Show Less" : "Show More"}
                </button>
              )}
              {commentFormData.post_id === post.id && (
                <div className="flex items-center mt-4 w-full">
                  <textarea
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a comment..."
                    value={commentFormData.comment || ""}
                    onChange={(e) =>
                      setCommentFormData({
                        ...commentFormData,
                        comment: e.target.value,
                      })
                    }
                  />
                  <Button
                    className="bg-green-500 px-4 py-2 rounded-md ml-3"
                    onClick={() => handleCreateComment(post.id)}
                  >
                    Post Comment
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <Cards className="bg-blue-500 flex justify-center">
            <p>No posts available.</p>
          </Cards>
        )}
      </div>

      <Modal isOpen={isPostModalOpen} className="bg-slate-300">
        <h2 className="font-poppins font-bold text-xl">Create Post</h2>
        <input
          className="w-full px-4 py-2 rounded-md mt-4"
          type="text"
          placeholder="Title"
          value={postFormData.title}
          onChange={(e) =>
            setPostFormData({ ...postFormData, title: e.target.value })
          }
        />
        <textarea
          className="w-full px-4 py-2 rounded-md mt-4"
          placeholder="Body"
          value={postFormData.body}
          onChange={(e) =>
            setPostFormData({ ...postFormData, body: e.target.value })
          }
        />
        <div className="flex gap-2">
          <Button
            className="bg-green-500 px-4 py-2 rounded-md mt-4"
            onClick={handleCreatePost}
          >
            Create Post
          </Button>
          <Button
            className="bg-red-500 px-4 py-2 rounded-md mt-4"
            onClick={() => setIsPostModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PostsAndComments;
