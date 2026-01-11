"use client"

import { CategoriesSelect } from "./CategoriesSelect";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from 'uuid';
import type { ChangeEvent } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import useSWR from 'swr';

type Inputs = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
};

const fetcher = async([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  if(!res.ok) {
    throw new Error('データの取得に失敗しました');
  }
  return res.json();
};

export default function PostForm({id}: {id: string | undefined}) {

  // const [title, setTitle] = useState('')
  // const [content, setContent] = useState('')
  // const [thumbnailUrl, setThumbnailUrl] = useState('')
  // const [categories, setCategories] = useState<Category[]>([])
  // const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null)  

  const router = useRouter()

  const { token } = useSupabaseSession()

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors, isSubmitting }, 
    setValue, 
    reset, 
    watch,
   } = useForm<Inputs>({
    defaultValues: {
      title: '',
      content: '',
      thumbnailImageKey: '',
      categories: [],
    }
  });

  const watchedThumbnailimageKey = watch('thumbnailImageKey');

    //IDに基づいて記事を取得
  // useEffect(() => {
  //   const fetcher = async () => {
  //     if (!token) return
  //     try{
  //     const res = await fetch(`/api/admin/posts/${id}`,{
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token,
  //       },
  //     })
  //     const data = await res.json()
      // setTitle(data.post.title)
      // setContent(data.post.content)
      // setThumbnailImageKey(data.post.thumbnailImageKey)
      // setCategories(data.post.postCategories.map((postCategory: { category: Category }) => postCategory.category))
  const { data, error, isLoading } = useSWR(
    id && token ? [`/api/admin/posts/${id}`, token]: null,
    fetcher
  );

  useEffect(() => {
    if(data?.post) {
      reset({
        title: data.post.title,
        content: data.post.content,
        thumbnailImageKey: data.post.thumbnailImageKey,
        categories: data.post.postCategories.map((postCategory: { category: Category }) => postCategory.category),
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (!watchedThumbnailimageKey) {
      setThumbnailImageUrl(null);
      return;
    }

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(watchedThumbnailimageKey);

      setThumbnailImageUrl(publicUrl)
    }

    fetcher();
  }, [watchedThumbnailimageKey]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

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
            title: data.title,
            content: data.content,
            thumbnailImageKey: data.thumbnailImageKey,
            categories: data.categories,
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
            title: data.title,
            content: data.content,
            thumbnailImageKey: data.thumbnailImageKey,
            categories: data.categories,
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
  // const handleChange =  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target
  //   switch (name) {
  //     case 'title':
  //       setTitle(value)
  //       break
  //     case 'content':
  //       setContent(value)
  //       break
  //     // case 'thumbnailUrl':
  //     //   setThumbnailUrl(value)
  //     //   break
  //   }
  // }

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
      // setThumbnailImageKey(data.path)
      setValue('thumbnailImageKey', data.path, {
        shouldDirty: true,
        shouldValidate: true
      });
  };

  if(id && isLoading) {
    return <div>読み込み中...</div>;
  }

  if(error) {
    return <div>エラーが発生しました</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {id && <h1 className="text-xl font-bold mb-8">記事編集</h1>}
      {!id && <h1 className="text-xl font-bold mb-8">新規作成</h1>}
      <div className="mb-4">
        <div className="">タイトル</div>
        <input id="title" type="text" className="w-full border border-gray-300 rounded h-8 p-6" {...register('title', {required: 'タイトルを入力してください'})}/>
        {errors.title && <span className="text-red-500">{errors.title.message}</span>}
      </div>
      <div className="mb-4">
        <div className="">内容</div>
        <textarea id="content" className="w-full border border-gray-300 rounded h-32 p-6" {...register('content', {required: '内容を入力してください'})}></textarea>
        {errors.content && <span className="text-red-500">{errors.content.message}</span>}
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
        <Controller name="categories" control={control} render={({ field }) => (
          <CategoriesSelect
            selectedCategories={field.value}
            setSelectedCategories={(categories) => field.onChange(categories)}
          />
        )}
        />
      </div>
      <div className="flex justify-left">
        <button type='submit' className="bg-gray-800 text-white font-bold rounded-lg px-6 py-2 mr-4 hover:cursor-pointer" disabled={isSubmitting}>{isSubmitting ? '更新中...' : id ? '更新' : '新規作成'}</button>
        {id && <button type='button' className="bg-gray-200 text-gray-800 font-bold rounded-lg px-6 py-2 hover:cursor-pointer" onClick={handleDelete}>削除</button>}
      </div>
    </form>
  )
}