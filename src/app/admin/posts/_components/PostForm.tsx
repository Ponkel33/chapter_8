"use client"

import { CategoriesSelect } from "./CategoriesSelect";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { supabase } from "@/utils/supabase"
import { v4 as uuidv4 } from 'uuid'
import type { ChangeEvent } from 'react'
import Image from 'next/image'

export default function PostForm({id}: {id: string | undefined}) {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null)  

  const router = useRouter()

  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      if (!id) {
        const res = await fetch("/api/admin/posts", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            title,
            content,
            thumbnailImageKey,
            categories,
          }),
        })
        const { id: newId } = await res.json()
        router.push(`/posts/${newId}`)
        alert('登録しました')
      } else {
        await fetch(`/api/admin/posts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            title,
            content,
            thumbnailImageKey,
            categories,
          }),
        })
        router.push(`/posts/${id}`)
        alert('更新しました')
      }
      
    } catch (error) {
      console.error('エラーが発生しました:', error)
    }
  }


  //削除のボタンハンドラー
  const handleDelete = async () => {
    if (!token) return
    
    try{
    await fetch(`/api/admin/posts/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      method: 'DELETE',
    })
    router.push(`/admin/posts`)
    alert('削除しました')
    } catch (error) {
      console.error('エラーが発生しました:', error)
    }
  }

  //フォームの更新時のハンドラー
  const handleChange =  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    switch (name) {
      case 'title':
        setTitle(value)
        break
      case 'content':
        setContent(value)
        break
      // case 'thumbnailUrl':
      //   setThumbnailUrl(value)
      //   break
    }
  }

  //サムネイル画像の変更
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return
    }
    const file = event.target.files[0]

    const filePath = `private/${uuidv4()}`

    const { data, error } = await supabase.storage
      .from('post_thumbnail')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (error) {
        alert(error.message)
        return
      }
      setThumbnailImageKey(data.path)
  }

  //IDに基づいて記事を取得
  useEffect(() => {
    const fetcher = async () => {
      if (!token) return
      try{
      const res = await fetch(`/api/admin/posts/${id}`,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      const data = await res.json()
      setTitle(data.post.title)
      setContent(data.post.content)
      setThumbnailImageKey(data.post.thumbnailImageKey)
      setCategories(data.post.postCategories.map((postCategory: { category: Category }) => postCategory.category))
      } catch (error) {
        console.error('エラーが発生しました:', error);
      }
    }
    fetcher();
  }, [id, token])

  useEffect(() => {
    if (!thumbnailImageKey) return

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])



  return (
    <div>
      {id && <h1 className="text-xl font-bold mb-8">記事編集</h1>}
      {!id && <h1 className="text-xl font-bold mb-8">新規作成</h1>}
      <div className="mb-4">
        <div className="">タイトル</div>
        <input id="title" value={title} name="title" type="text" className="w-full border border-gray-300 rounded h-8 p-6" onChange={handleChange}/>
      </div>
      <div className="mb-4">
        <div className="">内容</div>
        <textarea id="content" value={content} name="content" className="w-full border border-gray-300 rounded h-32 p-6" onChange={handleChange}></textarea>
      </div>
      <div className="mb-4">
        <div className="">サムネイルURL</div>
        <input type="file" id="thumbnailImageKey" onChange={handleImageChange} accept="image/*" />
      </div>
     {thumbnailImageUrl && (
      <div className="mt-2">
      <Image src={thumbnailImageUrl} alt="thumbnail" width={400} height={400}/>
      </div>
    )}
      <div className="mb-4">
        <div className="">カテゴリー</div>
        <CategoriesSelect selectedCategories={categories} setSelectedCategories={setCategories}/>
      </div>
      <div className="flex justify-left">
        <button type='button' className="bg-gray-800 text-white font-bold rounded-lg px-6 py-2 mr-4 hover:cursor-pointer" onClick={handleSubmit}>{id ? '更新' : '新規作成'}</button>
        {id && <button type='button' className="bg-gray-200 text-gray-800 font-bold rounded-lg px-6 py-2 hover:cursor-pointer" onClick={handleDelete}>削除</button>}
      </div>
  </div>
  )
}