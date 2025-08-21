import React, { useEffect, useMemo, useState } from 'react';
import { getPosts, getAllTags } from '../services/api';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async (params) => {
    setIsLoading(true);
    const res = await getPosts(params);
    setPosts(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllTags();
        setAllTags(res.data);
      } catch {}
    })();
  }, []);

  // Debounce search and tag filter, and search only by tags
  const debouncedParams = useMemo(() => ({ keyword: search, tag }), [search, tag]);

  useEffect(() => {
    const handle = setTimeout(() => {
      fetchPosts(debouncedParams);
    }, 400);
    return () => clearTimeout(handle);
  }, [debouncedParams.keyword, debouncedParams.tag]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <input type="text" placeholder="Search tags..." value={search} onChange={(e)=> setSearch(e.target.value)} className="p-2 border rounded mb-2 md:mb-0"/>
        <input type="text" placeholder="Filter by tag..." value={tag} onChange={(e)=> setTag(e.target.value)} className="p-2 border rounded"/>
        <button onClick={()=> navigate('/add-post')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-auto">Add Post</button>
      </div>
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-3 py-1 rounded border ${tag === t ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
            >
              {t}
            </button>
          ))}
          {tag && (
            <button onClick={() => setTag('')} className="px-3 py-1 rounded border bg-gray-100">Clear</button>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? <div>Loading...</div> : posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
