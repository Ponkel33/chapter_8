"use client";

import React from 'react';
// import { useState, useEffect } from 'react';
import { OwnPost } from '@/app/_types/Posts';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from "@/utils/supabase";
import useSWR from 'swr'

// type response = {
//   message: string;
//   post: MicroCMSPost;
// }

const fetcher = async(url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('データの取得に失敗しました')
  }
  return res.json()
}

export default function Posts() {
  const { id } = useParams<{ id: string }>();
  // const [post, setPost] = useState<OwnPost | null>(null);
  // const [loading, setLoading] = useState<boolean>(true)
  // const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)

  // useEffect(() => {
  //   const fetcher = async (): Promise<void> => {
  //     setLoading(true)
  //     if (!id) {
  //       setLoading(false);
  //       return;
  //     }

  //     try{
  //     const res = await fetch(`/api/posts/${id}`);
  //     // const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
  //     const data = await res.json();
  //     setPost(data.post) 
  //     }catch(error){
  //       console.log(error);
  //     }
  //     finally{
  //       setLoading(false);
  //     }
  //   }
  //   fetcher();
  // }, [id]);

  const {data, error, isLoading} = useSWR(
    id ? `/api/posts/${id}` : null,
    fetcher
  );

  if(isLoading)
    return <div>情報取得中...</div>

  if(error)
    return <div>エラーが発生しました</div>

  if(!data.post)
    return <div>投稿が見つかりません</div>

  const post: OwnPost = data.post;

  // useEffect(() => {
  //   if(!post?.thumbnailImageKey) return;
  //   const fetcher = async() => {
  //     const {
  //       data: { publicUrl },
  //     } = await supabase.storage
  //       .from('post_thumbnail')
  //       .getPublicUrl(post.thumbnailImageKey)

  //     setThumbnailImageUrl(publicUrl)
  //   }
  //   fetcher();
  // }, [post])

  let thumbnailImageUrl = null;
  if (post.thumbnailImageKey) {
    const { data: publicUrlData } = supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(post.thumbnailImageKey);
    thumbnailImageUrl = publicUrlData.publicUrl;
  }


  return (
    <div className="max-w-3xl mx-auto my-2 p-2">
      {thumbnailImageUrl && (
        <div className="mt-2">
        <Image src={thumbnailImageUrl} alt="thumbnail" width={400} height={400}/>
      </div>
      )}
      <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</div>
      <div className="flex justify-end">
      {post.postCategories.map(postCategory => {
        return (
          <div key={postCategory.category.id} className="text-blue-500 border border-blue-500 rounded mx-0.5 px-1">{postCategory.category.name}</div>
        )
      })}
      </div>
      <div className="text-2xl font-bold my-2">{post.title}</div>
      <div className="text-sm my-8" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div>
  )
}
