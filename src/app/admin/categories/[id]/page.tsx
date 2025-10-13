"use client"
import { useParams } from "next/navigation"
import CategoryForm from "../_components/CategoryForm"

export default function AdminCategoriesId() {
  const { id } = useParams()
  
 
  return (
<CategoryForm id={id as string}/>
  )
}