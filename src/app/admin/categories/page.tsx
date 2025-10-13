"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "@/app/_types/Category";


export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories")
      const data = await res.json()
      setCategories(data.categories)
    }
    fetcher()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
       <h1 className="text-xl font-bold">カテゴリー一覧</h1> 
       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
         <Link href="/admin/categories/new">新規作成</Link>
       </button>
      </div>
      <ul>
        {
          categories.map(category => {
            return(
              <li key={category.id} className="border-b border-gray-300 p-2 my-2 mb-4 hover:bg-gray-100 cursor-pointer">
                <Link href={`/admin/categories/${category.id}`} className="block p-2">{category.name}</Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
