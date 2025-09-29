import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CategoryRequestBody } from '@/app/_types/RequestBody';

const prisma = new PrismaClient();

export const GET = async (request: NextRequest, { params }: { params: { id: string } }, ) => {
  const { id } = params;

  try{
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    })
    return NextResponse.json({ status: 'OK', category: category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }, ) => {
  const { id } = params;
  const { name }: CategoryRequestBody = await request.json();
  try{
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })
    return NextResponse.json({ status: 'OK', category: category }, { status: 200 })
  } catch(error){
    if(error instanceof Error){
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}

export const DELETE = async(request: NextRequest, { params }: { params: {id: string } }, ) => {
  const { id } = params;
  try{
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    })
    return NextResponse.json({ status: 'OK', message: '削除しました'}, { status: 200 })
  } catch(error){
    if(error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}