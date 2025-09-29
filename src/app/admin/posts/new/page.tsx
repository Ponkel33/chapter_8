"use client"

import { useState } from "react";

import { Category } from "@/app/_types/Category";

export default function AdminPostsId() {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/admin/posts", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categories,
      }),
    })
    alert('登録しました')
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
      case 'thumbnailUrl':
        setThumbnailUrl(value)
        break
    }
  }

  //編集フォーム
  return (
    <div>
      <h1 className="text-xl font-bold mb-8">記事作成</h1>
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
        <input id="thumbnailUrl" value={thumbnailUrl} name="thumbnailUrl" type="text" className="w-full border border-gray-300 rounded h-8 p-6" onChange={handleChange}/>
      </div>
      <div className="mb-4">
        <div className="">カテゴリー</div>
        <select id="categories" name="categories" className="w-full border border-gray-300 rounded h-8 p-6">
            {categories.map(category => {
                return (
                    <option key={category.id} value={category.id}>{category.name}</option>
                )
            })}
        </select>
      </div>
      <div className="flex justify-left">
        <button type='submit' className="bg-gray-800 text-white font-bold rounded-lg px-6 py-2 mr-4 hover:cursor-pointer" onClick={handleSubmit}>送信</button>
      </div>
    </div>
  )
}