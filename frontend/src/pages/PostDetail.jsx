import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/ui/PostCard';
import { ArrowLeft } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id]);

  const handleDeletePost = () => {
    navigate('/dashboard');
  };

  if (!post) return <div className="flex justify-center mt-20 text-gray-500">Loading announcement...</div>;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 w-full pb-20">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full hover:bg-gray-200 text-gray-600 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Announcement details</h1>
      </div>
      <div className="ml-0 md:ml-[52px]">
        <PostCard post={post} onDelete={handleDeletePost} />
      </div>
    </div>
  );
}