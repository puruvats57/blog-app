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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <ul className="space-y-2">
            {allTags.map(t => (
              <li key={t}>
                <button
                  onClick={() => setTag(t)}
                  className={`block w-full text-left px-2 py-1 rounded ${tag === t ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-blue-700'}`}
                >
                  {t}
                </button>
              </li>
            ))}
            {tag && (
              <li>
                <button onClick={() => setTag('')} className="text-sm text-gray-600 hover:underline">Clear selection</button>
              </li>
            )}
          </ul>
        </aside>
        <main className="md:col-span-3">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
            <input type="text" placeholder="Search by keyword..." value={search} onChange={(e)=> setSearch(e.target.value)} className="p-2 border rounded mb-2 md:mb-0"/>
            <input type="text" placeholder="Filter by tag..." value={tag} onChange={(e)=> setTag(e.target.value)} className="p-2 border rounded"/>
            <button onClick={()=> navigate('/add-post')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 md:ml-auto">Add Post</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? <div>Loading...</div> : posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        </main>
      </div>
    </div>
  );
}
