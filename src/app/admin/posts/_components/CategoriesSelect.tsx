import * as React from 'react'
import { Category } from '@/app/_types/Category'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import useSWR from 'swr'
import { useFetch } from '@/app/_hooks/useFetch'

import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
// import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

type CategoriesResponse = {
  categories: Category[]
}

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
}

// const fetcher = async ([url, token]: [string, string]) => {
//   const res = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: token,
//     },
//   });
//   if(!res.ok) {
//     throw new Error('データ取得に失敗しました');
//   }
//   return res.json();
// };

export const CategoriesSelect = ({
  selectedCategories, setSelectedCategories
 }: Props) => {
  // const [categories, setCategories] = useState<Category[]>([])
  // const { token } = useSupabaseSession()

  const { data, error } = useFetch<CategoriesResponse>(`/api/admin/categories`);

  const categories: Category[] = data?.categories || [];

  ///カテゴリー選択処理
  const handleChange = (value: number[]) => {
    value.forEach((v: number) => {
      const isSelect = selectedCategories.some((c) => c.id === v)
      ///すでに選択されているカテゴリーの処理(選択解除)
      if(isSelect) {
        setSelectedCategories(selectedCategories.filter((c) => c.id !== v))
        return
      }
      ///クリックされたカテゴリを、選択済みのカテゴリリストに追加
      const category = categories.find((c) => c.id === v)
      if(!category) {
        return
      }
      setSelectedCategories([...selectedCategories, category])
    })
  }

  // useEffect(() => {
  //   const fetcher = async () => {
  //     if (!token) return
  //     const res = await fetch('/api/admin/categories',{
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token,
  //       },
  //     })
  //     const { categories } = await res.json()
  //     setCategories(categories)
  //   }
  //   fetcher()
  // }, [token])

  if(error)
    return <div>エラーが発生しました</div>

  return (
    <FormControl className="w-full">
      <Select
        multiple
        value={selectedCategories}
        onChange={(e) => handleChange((e.target.value as unknown as number[]))}
        input={<OutlinedInput />}
        renderValue={(selected: Category[]) => (
          <Box sx={{ desplay: 'flex', flexWrap: 'wrap', gap: 0.5}}>
            {selected.map((value: Category) => (
              <Chip key={value.id} label={value.name} />
            ))}
          </Box>
        )}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
    </FormControl>
  )
}