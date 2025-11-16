"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  name: string
}

export default function CategoryForm( {id}: {id: string | undefined}) {
  // const [name, setName] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Inputs>({
    defaultValues: {
      name: '',
    }
  });
  const router = useRouter()
  const { token } = useSupabaseSession()

  // const handleSubmit = async (e: React.FormEvent) => {
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // e.preventDefault()

    if (!token) return
    try{
      if (!id) {
        await fetch(`/api/admin/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            name: data.name,
          }),
        })
        alert('登録しました')
      } else {
        await fetch(`/api/admin/categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            name: data.name,
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
    if (!token) return
    try { 
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      router.push(`/admin/categories`)
      alert('削除しました')
    } catch (error) {
      console.error('エラーが発生しました:', error)
    }
  }


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target
  //   setName(value)
  // }

  useEffect(() => {
    if (!token) return
    if (!id) return
    const fetcher = async () => {
      try{
        const res = await fetch(`/api/admin/categories/${id}`,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        const data = await res.json()
          // setName(data.category.name)
          reset({
            name: data.category.name,
          })
      } catch (error) {
        console.error('エラーが発生しました:', error)
      }
    }
    fetcher()
  }, [id, token, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {id && <h1 className="text-xl font-bold pb-4">カテゴリー編集</h1>}
      {!id && <h1 className="text-xl font-bold pb-4">カテゴリー新規作成</h1>}
      <div className="mb-4">
        <div className="">カテゴリー名</div>
        <input id="name" type="text" className="w-full border border-gray-300 rounded h-8 p-6" {...register('name', {required: 'カテゴリー名を入力してください'})}/>
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      <div className="flex justify-left">
        <button type='submit' className="bg-gray-800 text-white font-bold rounded-lg px-6 py-2 mr-4 hover:cursor-pointer" disabled={isSubmitting}>{isSubmitting ? '更新中...' : id ? '更新' : '新規作成'}</button>
        {id && <button type='button' className="bg-gray-200 text-gray-800 font-bold rounded-lg px-6 py-2 hover:cursor-pointer" onClick={handleDelete}>削除</button>}
      </div>
    </form>
  )
}