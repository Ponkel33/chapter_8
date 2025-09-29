"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OwnPost } from '@/app/_types/Posts';


export default function AdminPosts() {

  const [posts, setPosts] = useState<OwnPost[]>([])
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/posts")
      const data = await res.json()
      setPosts(data.posts)
    }
  fetcher()
  }, [])

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
    
      </div>
      <ul>
    {
        posts.map(post => {
            return(
              <li key={post.id} className="border-b border-gray-300 p-2 my-2 mb-4 hover:bg-gray-100 cursor-pointer">
                <Link href={`/admin/posts/${post.id}`}>
                  <h1 className="text-xl font-bold">{post.title}</h1>
                  <div className="text-gray-500 text-sm pl-2">{new Date(post.createdAt).toLocaleDateString()}</div>
                </Link>
              </li>
            )
        })
    }
  </ul> 
  </div>
)
}