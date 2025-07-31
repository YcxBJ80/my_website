'use client'

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { 
  toggleBlogLike, 
  checkUserLikedBlog, 
  getBlogStats,
  type BlogStats 
} from '@/lib/blogData';

interface LikeButtonProps {
  blogId: string; // 改为blogId
  className?: string;
}

export function LikeButton({ blogId, className = '' }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const user = getCurrentUser();

  const loadLikeStatus = useCallback(async () => {
    try {
      // 获取博客统计信息
      const stats = await getBlogStats(blogId);
      setLikeCount(stats.likes);

      // 如果用户已登录，检查是否已点赞
      if (user) {
        const userLiked = await checkUserLikedBlog(blogId, user.uid);
        setIsLiked(userLiked);
      }
    } catch (error) {
      console.error('加载点赞状态失败:', error);
    }
  }, [blogId, user]);

  useEffect(() => {
    loadLikeStatus();
  }, [loadLikeStatus]);

  const handleToggleLike = async () => {
    if (!user) {
      alert('请先登录后再点赞');
      return;
    }

    if (isUpdating) return; // 防止重复点击

    // 客户端优先：立即更新UI
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);
    setIsUpdating(true);

    // 异步更新到服务端
    try {
      const serverLikedState = await toggleBlogLike(blogId, user.uid);
      
      // 如果服务端结果与客户端预期不一致，以服务端为准
      if (serverLikedState !== newLikedState) {
        setIsLiked(serverLikedState);
        // 重新获取准确的点赞数
        const stats = await getBlogStats(blogId);
        setLikeCount(stats.likes);
      }
    } catch (error) {
      console.error('切换点赞状态失败:', error);
      // 发生错误时恢复到之前的状态
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={!user || isUpdating}
      className={`flex items-center space-x-2 transition-all duration-200 ${
        isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-muted-foreground hover:text-red-500'
      } ${!user ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      title={!user ? '请先登录' : isLiked ? '取消点赞' : '点赞'}
    >
      <svg 
        className={`w-5 h-5 transition-all duration-200 ${
          isLiked ? 'fill-current' : 'fill-none'
        }`} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
} 