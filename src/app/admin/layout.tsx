"use client";

import Link from "next/link";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
    <div className="w-1/4 bg-gray-200 p-4 h-screen">
      <Link className="p-4 block hover:bg-gray-300" href="/admin/posts">記事一覧</Link>
      <Link className="p-4 block hover:bg-gray-300" href="/admin/categories">カテゴリー一覧</Link>
    </div>
    <div className="w-3/4 p-4">{children}</div>
    </div>
  )
}