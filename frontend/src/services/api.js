import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if(token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = data => API.post('/auth/register', data);
export const loginUser = data => API.post('/auth/login', data);
export const getPosts = params => API.get('/posts', { params });
export const getPost = id => API.get(`/posts/${id}`);
export const addPost = data => API.post('/posts', data);
export const likePost = id => API.put(`/posts/${id}/like`);
export const getAllTags = () => API.get('/posts/_tags/all');
export const getComments = postId => API.get(`/comments/post/${postId}`);
export const addComment = data => API.post(`/comments`, data);
// Add this function
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);

