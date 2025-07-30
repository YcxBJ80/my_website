'use client'

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { 
  toggleBlogLike, 
  checkUserLikedBlog, 
  getBlogStats,
  type BlogStats 
} from '@/lib/blogData';

interface LikeButtonProps {
  blogSlug: string;
}

export function LikeButton({ blogSlug }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    loadLikeStatus();
  }, [blogSlug, user]);

  const loadLikeStatus = async () => {
    try {
      // 获取博客统计信息
      const stats = await getBlogStats(blogSlug);
      setLikeCount(stats.likes);

      // 如果用户已登录，检查是否已点赞
      if (user) {
        const userLiked = await checkUserLikedBlog(blogSlug, user.uid);
        setIsLiked(userLiked);
      }
    } catch (error) {
      console.error('加载点赞状态失败:', error);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      alert('请先登录后再点赞');
      return;
    }

    try {
      setIsLoading(true);
      const newLikedState = await toggleBlogLike(blogSlug, user.uid);
      setIsLiked(newLikedState);
      
      // 更新点赞数
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('切换点赞状态失败:', error);
      alert('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
        isLiked
          ? 'bg-gradient-to-r from-monet-pink to-monet-purple text-white shadow-lg hover:shadow-monet-pink/20'
          : 'bg-card border border-border text-card-foreground hover:bg-accent hover:text-monet-pink'
      }`}
    >
      <svg 
        className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-current' : ''}`} 
        fill={isLiked ? 'currentColor' : 'none'} 
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
      <span>{isLoading ? '...' : likeCount}</span>
      <span className="hidden sm:inline">{isLiked ? '已点赞' : '点赞'}</span>
    </button>
  );
} 