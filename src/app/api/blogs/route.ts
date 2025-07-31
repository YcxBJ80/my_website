import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, isConfigValid } from '@/lib/firebase';

interface BlogData {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  slug: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  content: string;
}

export async function GET() {
  try {
    // 检查Firebase配置
    if (!isConfigValid || !db) {
      return NextResponse.json({ error: 'Firebase配置无效' }, { status: 500 });
    }

    // 从Firestore获取博客列表
    const blogsQuery = query(
      collection(db, 'blogs'), 
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(blogsQuery);
    const blogs: BlogData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      blogs.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        author: data.author,
        date: data.date?.toDate?.()?.toISOString() || data.date,
        slug: data.slug,
        tags: data.tags || [],
        views: data.views || 0,
        likes: data.likes || 0,
        comments: data.comments || 0,
        content: data.content
      });
    });

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('获取博客失败:', error);
    
    // 提供更详细的错误信息
    let errorMessage = '获取博客失败';
    if (error.code === 'permission-denied') {
      errorMessage = 'Firestore权限不足，请检查安全规则配置';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firebase服务不可用，请稍后重试';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 