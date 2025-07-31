import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
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
    
    // 并行获取所有博客的统计数据
    const blogStatsPromises = querySnapshot.docs.map(async (blogDoc) => {
      const data = blogDoc.data();
      
      // 获取对应的统计数据
      let stats = { views: 0, likes: 0, comments: 0 };
      try {
        const statsDoc = await getDoc(doc(db, 'blogStats', blogDoc.id));
        if (statsDoc.exists()) {
          const statsData = statsDoc.data();
          stats = {
            views: statsData.views || 0,
            likes: statsData.likes || 0,
            comments: statsData.comments || 0
          };
        }
      } catch (statsError) {
        console.warn(`获取博客 ${blogDoc.id} 统计数据失败:`, statsError);
        // 使用默认值，不影响整体流程
      }
      
      return {
        id: blogDoc.id,
        title: data.title,
        description: data.description,
        author: data.author,
        date: data.date?.toDate?.()?.toISOString() || data.date,
        slug: data.slug,
        tags: data.tags || [],
        views: stats.views,
        likes: stats.likes,
        comments: stats.comments,
        content: data.content
      };
    });
    
    // 等待所有数据加载完成
    const blogsWithStats = await Promise.all(blogStatsPromises);

    // 添加no-cache头部，确保数据实时更新
    return NextResponse.json(blogsWithStats, { 
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    console.error('获取博客失败:', error);
    let errorMessage = '获取博客失败';
    if (error.code === 'permission-denied') {
      errorMessage = 'Firestore权限不足，请检查安全规则配置';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firebase服务不可用，请稍后重试';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 