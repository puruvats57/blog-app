import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  return (
    <div onClick={()=> navigate(`/posts/${post._id}`)} className="border rounded p-4 shadow hover:shadow-lg cursor-pointer transition">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="text-gray-700">{post.content.slice(0,100)}...</p>
      <div className="mt-2">
        {post.tags.map(tag => <span key={tag} className="text-sm bg-blue-100 text-blue-700 px-2 py-1 mr-1 rounded">{tag}</span>)}
      </div>
      <p className="mt-2 text-gray-500">{post.likes} Likes</p>
    </div>
  );
}
