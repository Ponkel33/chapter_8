import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { PostRequestBody } from '@/app/_types/RequestBody';
import { supabase } from '@/utils/supabase'

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''

  /// supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token)

  if (error)
  return NextResponse.json({ status: error.message }, { status: 400 })
  /// tokenが正しい場合、以降が実行される

  try {
    const posts = await prisma.post.findMany({
    include: {
      postCategories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        }, 
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
  } catch(error){
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try{
    const body = await request.json()
    const { title, content, categories, thumbnailImageKey }: PostRequestBody = body
    const data = await prisma.post.create({
      data: {
        title, content, thumbnailImageKey,
      },
    })
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
          },
        })
      }
      return NextResponse.json({
        status: 'OK',
        message: '作成しました',
        id: data.id,
      })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}