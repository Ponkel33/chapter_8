"use client"
import { useState } from "react";
import { useRouter } from "next/navigation"

export default function AdminCategoriesId() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setName(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/admin/categories", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    })
    router.push(`/admin/categories`)
    alert('登録しました')
  }

  return (
    <div>
      <h1 className="text-xl font-bold">カテゴリー編集</h1>
      <div className="mb-4">
        <div className="">カテゴリー名</div>
        <input id="name" value={name} name="name" type="text" className="w-full border border-gray-300 rounded h-8 p-6" onChange={handleChange}/>
      </div>
      <div className="flex justify-left">
        <button type='submit' className="bg-gray-800 text-white font-bold rounded-lg px-6 py-2 mr-4 hover:cursor-pointer" onClick={handleSubmit}>登録</button>
      </div>
    </div>
  )
}