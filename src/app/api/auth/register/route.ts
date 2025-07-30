import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    // 验证输入
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: '邮箱、密码和用户名都是必填项' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为6位' },
        { status: 400 }
      );
    }

    // 创建用户账户
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 创建用户资料
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      role: 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginTime: serverTimestamp(),
      isActive: true
    });

    return NextResponse.json(
      { 
        message: '注册成功',
        user: {
          uid: user.uid,
          email: user.email,
          username
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('注册错误:', error);
    
    let errorMessage = '注册失败，请重试';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = '该邮箱已被使用';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '密码强度不够';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '邮箱格式不正确';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
} 