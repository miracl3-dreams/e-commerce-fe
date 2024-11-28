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
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 1;

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, [currentPage]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await axios.get(`/api/v1/posts?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setPosts(response.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchComments = async (postId) => {
    setLoadingComments(true);
    try {
      const response = await axios.get(`/api/v1/posts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setComments((prevComments) => [
        ...prevComments.filter((comment) => comment.post_id !== postId),
        ...(response.data?.data?.data || []),
      ]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      await axios.post("/api/v1/posts", postFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setPostFormData({ title: "", body: "" });
      setIsPostModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
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
        {
          body: commentFormData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setCommentFormData({});
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleShowCommentForm = (postId) => {
    setCommentFormData((prevData) => ({
      ...prevData,
      post_id: postId,
    }));
  };

  const handleToggleComments = (postId) => {
    setShowAllComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleNextPost = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPost = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    document.title = "Posts and Comments - Task Management";
  });

  return (
    <div className="bg-white relative flex flex-col items-center h-full w-full">
      <h1 className="font-poppins font-bold text-3xl text-black py-8">
        Posts and Comments
      </h1>

      {/* Create Post Button Section */}
      <div className="flex justify-center w-full mb-4">
        <Button
          className="bg-green-500 px-6 py-3 rounded-md"
          onClick={() => setIsPostModalOpen(true)}
        >
          Create Post
        </Button>
      </div>

      {/* Posts List Section */}
      <div className="w-full max-w-5xl">
        <h2 className="font-poppins text-2xl text-black py-4 flex justify-center">
          Posts
        </h2>
        {loadingPosts ? (
          <div>
            <Cards className="bg-blue-500 flex justify-center">
              <p>Loading posts...</p>
            </Cards>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-blue-300 p-4 rounded-md mb-4">
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.body}</p>

              {/* Show comment creation form for this post */}
              <div className="flex justify-center">
                <Button
                  className="bg-blue-500 px-4 py-2 rounded-md mt-4"
                  onClick={() => handleShowCommentForm(post.id)}
                >
                  Write a comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="w-full mt-4">
                {comments
                  .filter((comment) => comment.post_id === post.id)
                  .slice(0, showAllComments[post.id] ? undefined : 10)
                  .map((comment) => {
                    // Log the comment's unique key (post.id + comment.id)
                    console.log(`Comment Key: ${post.id}-${comment.id}`);
                    return (
                      <div
                        key={`${post.id}-${comment.id}`} // Unique key combining post and comment id
                        className="flex bg-gray-200 p-3 rounded-md mb-3"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {comment.username || "Example User"}
                          </h4>
                          <p>{comment.body}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Show more comments button */}
              {comments.filter((comment) => comment.post_id === post.id)
                .length > 5 && (
                <Button
                  className="bg-gray-500 px-4 py-2 rounded-md mt-4"
                  onClick={() => handleToggleComments(post.id)}
                >
                  {showAllComments[post.id] ? "Show Less" : "Show More"}
                </Button>
              )}

              {/* Comment Form */}
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
          <div>
            <Cards className="bg-blue-500 flex justify-center">
              <p>No posts available.</p>
            </Cards>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <Button
            className="bg-gray-500 px-4 py-2 rounded-md"
            onClick={handlePrevPost}
            disabled={currentPage === 1}
          >
            Previous Post
          </Button>
          <Button
            className="bg-gray-500 px-4 py-2 rounded-md ml-4"
            onClick={handleNextPost}
          >
            Next Post
          </Button>
        </div>
      </div>

      {/* Post Creation Modal */}
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
            Save
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
