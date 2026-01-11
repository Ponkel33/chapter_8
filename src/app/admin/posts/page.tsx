"use client";
import Link from 'next/link';
// import { useEffect, useState } from 'react';
import { OwnPost } from '@/app/_types/Posts';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import useSWR from "swr"


const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  })
  if(!res.ok) {
    throw new Error('データの取得に失敗しました')
  }
  return res.json()
}

export default function AdminPosts() {

  // const [posts, setPosts] = useState<OwnPost[]>([])
  const { token } = useSupabaseSession()

  // useEffect(() => {
  //   if (!token) return

  //   const fetcher = async () => {
  //     const res = await fetch('/api/admin/posts', {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token, /// Header に token を付与
  //       },
  //     })
  //     const { posts } = await res.json()
  //     setPosts([...posts])
  //   }

  //   fetcher()
  // }, [token])


  const {data, error, isLoading} = useSWR(
    token ? ['/api/admin/posts', token] : null,
    fetcher
  )

  if(isLoading)
    return <div>読み込み中...</div>

  if(error)
    return <div>エラーが発生しました</div>

  const posts: OwnPost[] = data?.posts || [] 

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