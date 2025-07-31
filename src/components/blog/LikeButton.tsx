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

  // Check if user is already logged in
  useEffect(() => {
    if (user && blogId) {
      loadLikeStatus();
    }
  }, [user, blogId]);

  const loadLikeStatus = async () => {
    if (!user) return;
    
    try {
      // If user is logged in, check if already liked
      const response = await fetch(`/api/stats?action=getUserLikeStatus&blogId=${blogId}&userId=${user.uid}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      setIsLiked(data.isLiked || false);
    } catch (error) {
      console.error('Failed to load like status:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login first to like');
      return;
    }

    // Optimistic update
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    // 异步更新到服务端
    try {
      const serverLikedState = await toggleBlogLike(blogId, user.uid);
      
      // 如果服务端结果与客户端预期不一致，以服务端为准
      if (serverLikedState !== previousIsLiked) {
        setIsLiked(serverLikedState);
        // 重新获取准确的点赞数
        const stats = await getBlogStats(blogId);
        setLikeCount(stats.likes);
      }
    } catch (error) {
      console.error('切换点赞状态失败:', error);
      // 发生错误时恢复到之前的状态
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={!user || isUpdating}
      className={`flex items-center space-x-2 transition-all duration-200 ${
        isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-muted-foreground hover:text-red-500'
      } ${!user ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      title={!user ? 'Please login' : isLiked ? 'Unlike' : 'Like'}
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