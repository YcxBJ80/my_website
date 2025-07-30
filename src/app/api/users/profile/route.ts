import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 获取用户资料
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    
    // 移除敏感信息
    const { ...publicData } = userData;
    
    return NextResponse.json({
      user: {
        id: userDoc.id,
        ...publicData
      }
    });

  } catch (error) {
    console.error('获取用户资料失败:', error);
    return NextResponse.json(
      { error: '获取用户资料失败' },
      { status: 500 }
    );
  }
}

// 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    const { userId, username, bio, interests, avatar } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 构建更新数据
    const updateData: any = {
      updatedAt: serverTimestamp()
    };

    if (username) updateData.username = username.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (interests) updateData.interests = interests;
    if (avatar) updateData.avatar = avatar;

    // 更新用户资料
    await updateDoc(doc(db, 'users', userId), updateData);

    return NextResponse.json(
      { message: '资料更新成功' },
      { status: 200 }
    );

  } catch (error) {
    console.error('更新用户资料失败:', error);
    return NextResponse.json(
      { error: '更新资料失败' },
      { status: 500 }
    );
  }
} 