import React, { useState, useEffect } from 'react';
import { addPost, getPost, updatePost } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddPost() {
  const { id } = useParams(); // id present if editing
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      navigate('/login');
      return;
    }
    if(id){
      // fetch post data for editing
      const fetchPost = async () => {
        const res = await getPost(id);
        setTitle(res.data.title);
        setContent(res.data.content);
        setTags(res.data.tags.join(', '));
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagArray = tags.split(',').map(tag => tag.trim());
    try {
      if(id){
        await updatePost(id, { title, content, tags: tagArray });
      } else {
        await addPost({ title, content, tags: tagArray });
      }
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Error saving post');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Post' : 'Add New Post'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Title" value={title} 
          onChange={(e)=> setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea 
          placeholder="Summary" value={content} 
          onChange={(e)=> setContent(e.target.value)}
          className="w-full p-2 border rounded h-40"
          required
        />
        <input 
          type="text" placeholder="Tags (comma separated)" value={tags} 
          onChange={(e)=> setTags(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {id ? 'Update Post' : 'Add Post'}
        </button>
      </form>
    </div>
  );
}
