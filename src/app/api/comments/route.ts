import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('blogSlug');

    if (!blogSlug) {
      return NextResponse.json(
        { error: '缺少博客标识' },
        { status: 400 }
      );
    }

    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('blogSlug', '==', blogSlug),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ comments });

  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    );
  }
}

// 添加新评论
export async function POST(request: NextRequest) {
  try {
    const { blogSlug, content, authorId, authorName } = await request.json();

    // 验证输入
    if (!blogSlug || !content || !authorId || !authorName) {
      return NextResponse.json(
        { error: '缺少必要信息' },
        { status: 400 }
      );
    }

    if (content.trim().length < 1) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      );
    }

    // 添加评论到数据库
    const commentData = {
      blogSlug,
      content: content.trim(),
      authorId,
      authorName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'comments'), commentData);

    return NextResponse.json(
      { 
        message: '评论添加成功',
        commentId: docRef.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('添加评论失败:', error);
    return NextResponse.json(
      { error: '添加评论失败' },
      { status: 500 }
    );
  }
}

// 删除评论
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 这里可以添加权限检查
    // 确保只有评论作者或管理员可以删除评论

    await deleteDoc(doc(db, 'comments', commentId));

    return NextResponse.json(
      { message: '评论删除成功' },
      { status: 200 }
    );

  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    );
  }
} 