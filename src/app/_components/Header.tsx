"use client";

import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <Link className="text-lg font-bold text-white" href="/">Blog</Link>
      <Link className="text-lg font-bold text-white" href="/admin/posts">管理画面</Link>
    </header>
  );
}
