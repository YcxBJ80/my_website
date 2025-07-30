import { NextRequest, NextResponse } from 'next/server';
import { createBlog } from '@/lib/blogOperations';

export async function POST(request: NextRequest) {
  try {
    const blogData = await request.json();
    
    // 验证必需字段
    if (!blogData.title || !blogData.content || !blogData.author) {
      return NextResponse.json(
        { error: '标题、内容和作者为必填项' },
        { status: 400 }
      );
    }

    const result = await createBlog(blogData);
    
    return NextResponse.json(
      { message: '博客创建成功', ...result },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建博客失败:', error);
    return NextResponse.json(
      { error: '创建博客失败' },
      { status: 500 }
    );
  }
} 