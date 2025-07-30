'use client'

import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface CreateBlogData {
  title: string;
  description: string;
  content: string;
  tags: string[];
  author: string;
  authorId: string;
}

export async function createBlog(blogData: CreateBlogData) {
  try {
    // 生成slug
    const slug = generateSlug(blogData.title);
    
    // 添加到Firebase
    const blogRef = await addDoc(collection(db, 'blogs'), {
      ...blogData,
      slug,
      date: serverTimestamp(),
      published: true,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 注意：在客户端环境中无法写入文件
    // 博客内容已保存到Firebase，可以通过API获取

    return { id: blogRef.id, slug };
  } catch (error) {
    console.error('创建博客失败:', error);
    throw error;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .trim();
}

export async function updateBlogTags(blogId: string, tags: string[]) {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      tags,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('更新博客标签失败:', error);
    throw error;
  }
}

// 生成随机颜色
export function generateTagColor(tag: string): string {
  // 基于标签名生成一致的颜色
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 生成明亮的颜色
  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash) % 20); // 45-65%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
} 