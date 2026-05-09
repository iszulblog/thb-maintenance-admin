'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Menggunakan Supabase Auth untuk log masuk
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      // Halakan ke Dashboard utama selepas berjaya[cite: 1, 5]
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="w-96 rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-blue-900">THB Admin Login</h1>
        <input 
          type="email" 
          placeholder="Email Admin" 
          className="mb-4 w-full rounded border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="mb-6 w-full rounded border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full rounded bg-blue-900 p-2 text-white hover:bg-blue-800">
          Login ke Dashboard
        </button>
      </form>
    </div>
  );
}