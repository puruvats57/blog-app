import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, likePost, getComments, addComment } from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState(null); // ID of comment being replied to
  const replyingToUser = replyTo
    ? (comments.find(c => String(c._id) === String(replyTo))?.user?.username || null)
    : null;

  const fetchPost = async () => {
    const res = await getPost(id);
    setPost(res.data);
    setLikeCount(res.data.likes);
    if (user) {
      setLiked((res.data.likedBy || []).some(u => String(u) === String(user._id)));
    } else {
      setLiked(false);
    }
  };

  const fetchComments = async () => {
    const res = await getComments(id);
    setComments(res.data);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like posts');
    try {
      const res = await likePost(id);
      setLikeCount(res.data.likes);
      setLiked(res.data.liked);
    } catch (e) {
      // silent failure for toggle
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');

    await addComment({
      post: id,
      content: commentContent,
      parentComment: replyTo,
    });

    setCommentContent('');
    setReplyTo(null);
    fetchComments();
  };

  const renderComments = (list, parentId = null, level = 0) => {
    return list
      .filter(c => String(c.parentComment) === String(parentId))
      .map(c => (
        <div key={c._id} className={`ml-${level * 6} border-l pl-2 mb-2`}>
          <p className="font-semibold">{c.user.username}</p>
          <p>{c.content}</p>
          <div className="flex gap-2">
            {user && (
              <button
                onClick={() => setReplyTo(c._id)}
                className="text-sm text-blue-500 hover:underline"
              >
                Reply
              </button>
            )}
          </div>
          {renderComments(list, c._id, level + 1)}
        </div>
      ));
  };

  if (!post) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-2">
        By {post.author.username} | {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="mb-4">
        {post.tags.map(tag => (
          <span key={tag} className="text-sm bg-blue-100 text-blue-700 px-2 py-1 mr-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      <p className="mb-4">{post.content}</p>
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded mb-4 text-white ${liked ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'}`}
      >
        {liked ? 'Unlike' : 'Like'} ({likeCount})
      </button>

      {user && String(user._id) === String(post.author._id) && (
        <button
          onClick={() => navigate(`/edit-post/${post._id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4 ml-2"
        >
          Edit Post
        </button>
      )}

      <h2 className="text-xl font-bold mb-2">Comments</h2>
      <form onSubmit={handleComment} className="mb-4">
        {replyTo && (
          <p className="text-sm text-gray-600 mb-1">
            Replying to: {replyingToUser || 'comment'}
            <button
              onClick={() => setReplyTo(null)}
              className="text-red-500 hover:underline ml-2"
              type="button"
            >
              Cancel
            </button>
          </p>
        )}
        <textarea
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded h-20 mb-2"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {replyTo ? 'Reply' : 'Comment'}
        </button>
      </form>

      <div>{renderComments(comments)}</div>
    </div>
  );
}
