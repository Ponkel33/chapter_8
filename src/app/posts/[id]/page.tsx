"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { MicroCMSPost } from '@/app/_types/Posts';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// type response = {
//   message: string;
//   post: MicroCMSPost;
// }

export default function Posts() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<MicroCMSPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      setLoading(true)
      if (!id) {
        setLoading(false);
        return;
      }

      try{
      const res = await fetch(`https://vmqw2afmcl.microcms.io/api/v1/posts/${id}`, {
        headers: {
          'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      // const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
      const data : MicroCMSPost = await res.json();
      setPost(data) 
      }catch(error){
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    }
    fetcher();
  }, [id]);

  if (loading) {
    return (
      <div className="text-2xl text-center">情報取得中…</div>
    )
  }

  if (!post) {
    return (
      <div className="text-2xl text-center">投稿が見つかりませんでした</div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto my-2 p-2">
      <Image width={post.thumbnail.width} height={post.thumbnail.height} className="object-cover" src={post.thumbnail.url} alt="" />
      <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</div>
      <div className="flex justify-end">
      {post.categories.map(category => {
        return (
          <div key={category.id} className="text-blue-500 border border-blue-500 rounded mx-0.5 px-1">{category.name}</div>
        )
      })}
      </div>
      <div className="text-2xl font-bold my-2">{post.title}</div>
      <div className="text-sm my-8" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div>
  )
}
