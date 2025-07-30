import { NextResponse } from 'next/server';
import { getAllBlogs } from '@/lib/blogs';

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('获取博客失败:', error);
    return NextResponse.json({ error: '获取博客失败' }, { status: 500 });
  }
} 