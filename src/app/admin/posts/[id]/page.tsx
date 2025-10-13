"use client"

import { useParams } from "next/navigation";
import PostForm from "../_components/PostForm";

export default function AdminPostsId() {
  const { id } = useParams()

  //編集フォーム
  return (
    <PostForm id={id as string}/>
  )
}