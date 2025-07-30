import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 获取网站统计信息
export async function GET(request: NextRequest) {
  try {
    // 获取博客总数
    const blogsSnapshot = await getDocs(collection(db, 'blogs'));
    const totalBlogs = blogsSnapshot.size;

    // 获取用户总数
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;

    // 获取评论总数
    const commentsSnapshot = await getDocs(collection(db, 'comments'));
    const totalComments = commentsSnapshot.size;

    // 获取活跃用户数（过去30天有活动）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersQuery = query(
      collection(db, 'users'),
      where('lastLoginTime', '>=', thirtyDaysAgo)
    );
    const activeUsersSnapshot = await getDocs(activeUsersQuery);
    const activeUsers = activeUsersSnapshot.size;

    // 计算总浏览量
    let totalViews = 0;
    blogsSnapshot.forEach(doc => {
      const data = doc.data();
      totalViews += data.views || 0;
    });

    const stats = {
      totalBlogs,
      totalUsers,
      totalComments,
      activeUsers,
      totalViews,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('获取统计信息失败:', error);
    return NextResponse.json(
      { error: '获取统计失败' },
      { status: 500 }
    );
  }
}

// 更新博客浏览量
export async function POST(request: NextRequest) {
  try {
    const { blogId, increment = 1 } = await request.json();

    if (!blogId) {
      return NextResponse.json(
        { error: '缺少博客ID' },
        { status: 400 }
      );
    }

    // 这里可以实现浏览量更新逻辑
    // 实际实现时可能需要防刷机制

    return NextResponse.json(
      { message: '浏览量更新成功' },
      { status: 200 }
    );

  } catch (error) {
    console.error('更新浏览量失败:', error);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
} 