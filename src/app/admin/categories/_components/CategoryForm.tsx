"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CategoryForm( {id}: {id: string | undefined}) {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      if (!id) {
        await fetch(`/api/admin/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
          }),
        })
        alert('登録しました')
      } else {
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
    } catch (error) {
      console.error('エラーが発生しました:', error)
    }
    router.push(`/admin/categories`)
  }
  
  const handleDelete = async () => {
    try { 
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })
      router.push(`/admin/categories`)
      alert('削除しました')
    } catch (error) {
      console.error('エラーが発生しました:', error)
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setName(value)
  }

  useEffect(() => {
    if (!id) return
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
        {id && <button type='button' className="bg-gray-200 text-gray-800 font-bold rounded-lg px-6 py-2 hover:cursor-pointer" onClick={handleDelete}>削除</button>}
      </div>
    </div>
  )
}