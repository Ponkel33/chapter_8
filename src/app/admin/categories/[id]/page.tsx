"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"


export default function AdminCategoriesId() {
  const { id } = useParams()
  const [name, setName] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    })
    alert('更新しました')
  }

  const handleDelete = async () => {
    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    })
    alert('削除しました')
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setName(value)
  }

  useEffect(() => {
    const fetcher = async () => {
      try{
        const res = await fetch(`/api/admin/categories/${id}`)
        const data = await res.json()
        setName(data.category.name)
      } catch (error) {
        console.error('エラーが発生しました:', error)
      }
    }
    fetcher()
  }, [id])

  return (
    <div>
      <h1 className="text-xl font-bold">カテゴリー編集</h1>
      <div className="mb-4">
        <div className="">カテゴリー名</div>
        <input id="name" value={name} name="name" type="text" className="w-full border border-gray-300 rounded h-8 p-6" onChange={handleChange}/>
      </div>
      <div className="flex justify-left">
        <button type='submit' className="bg-gray-800 text-white font-bold rounded-lg px-6 py-2 mr-4 hover:cursor-pointer" onClick={handleSubmit}>更新</button>
        <button type='button' className="bg-gray-200 text-gray-800 font-bold rounded-lg px-6 py-2 hover:cursor-pointer" onClick={handleDelete}>削除</button>
      </div>
    </div>
  )
}