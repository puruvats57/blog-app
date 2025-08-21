import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email:'', password:'' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            console.log(err);
            alert('Login failed');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="email" placeholder="Email" value={form.email} 
                    onChange={(e)=> setForm({...form, email: e.target.value})} 
                    className="w-full p-2 border rounded" required
                />
                <input 
                    type="password" placeholder="Password" value={form.password} 
                    onChange={(e)=> setForm({...form, password: e.target.value})} 
                    className="w-full p-2 border rounded" required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
}
