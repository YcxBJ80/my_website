import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blogId'); // 改为blogId

    if (!blogId) {
      return NextResponse.json({ error: 'blogId is required' }, { status: 400 })
    }

    // 查询评论
    const commentsQuery = query(
      collection(db, 'comments'),
      where('blogId', '==', blogId), // 改为blogId
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(commentsQuery)
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(comments)
  } catch (error) {
    console.error('获取评论失败:', error)
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { blogId, content, authorId, authorName } = await request.json(); // 改为blogId

    // 验证必需字段
    if (!blogId || !content || !authorId || !authorName) {
      return NextResponse.json({ error: '缺少必需字段' }, { status: 400 })
    }

    // 添加评论
    const commentData = {
      blogId, // 改为blogId
      content,
      authorId,
      authorName,
      createdAt: new Date(),
      likes: 0,
      likedBy: []
    }

    const docRef = await addDoc(collection(db, 'comments'), commentData)

    return NextResponse.json({ 
      id: docRef.id,
      ...commentData
    })
  } catch (error) {
    console.error('添加评论失败:', error)
    return NextResponse.json({ error: '添加评论失败' }, { status: 500 })
  }
} 