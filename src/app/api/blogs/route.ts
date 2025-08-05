import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    // 检查Firebase配置
    if (!isConfigValid || !db) {
      return NextResponse.json({ error: 'Firebase配置无效' }, { status: 500 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const timestamp = searchParams.get('t');
    const forceRefresh = searchParams.get('force') === '1';
    
    console.log(`🔄 API: 处理博客请求 (timestamp: ${timestamp}, force: ${forceRefresh})`);

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

    console.log(`🔄 API: 返回 ${blogsWithStats.length} 篇博客数据 (${new Date().toISOString()})`);

    // 根据是否强制刷新设置不同的缓存策略
    const headers: Record<string, string> = {
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`,
    };

    if (forceRefresh) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
      headers['Vary'] = '*';
      headers['X-Force-Refresh'] = 'true';
    } else {
      headers['Cache-Control'] = 'public, max-age=60, s-maxage=300'; // 1分钟客户端缓存，5分钟CDN缓存
    }

    return NextResponse.json(blogsWithStats, { 
      headers
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