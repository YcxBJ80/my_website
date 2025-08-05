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
  blogId: string;
  className?: string;
}

export function LikeButton({ blogId, className = '' }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  // 加载点赞状态和数量
  const loadLikeStatus = useCallback(async () => {
    if (!blogId) return;
    
    try {
      setIsLoading(true);
      
      // 并行获取点赞状态和统计数据
      const [likeStatusResponse, stats] = await Promise.all([
        user ? fetch(`/api/stats?action=getUserLikeStatus&blogId=${blogId}&userId=${user.uid}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }) : Promise.resolve({ json: () => Promise.resolve({ isLiked: false }) }),
        getBlogStats(blogId)
      ]);

      if (user) {
        const likeData = await likeStatusResponse.json();
        setIsLiked(likeData.isLiked || false);
      } else {
        setIsLiked(false);
      }
      
      setLikeCount(stats.likes);
    } catch (error) {
      console.error('Failed to load like status:', error);
      // 出错时设置默认值
      setIsLiked(false);
      setLikeCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [blogId, user]);

  // 初始加载和用户变化时重新加载
  useEffect(() => {
    loadLikeStatus();
  }, [loadLikeStatus]);

  // 页面获得焦点时重新加载状态
  useEffect(() => {
    const handleFocus = () => {
      if (blogId) {
        console.log('🔄 Window focused, reloading like status');
        loadLikeStatus();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && blogId) {
        console.log('🔄 Page visible, reloading like status');
        loadLikeStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [blogId, loadLikeStatus]);

  const handleLike = async () => {
    if (!user) {
      alert('Please login first to like');
      return;
    }

    if (isUpdating) return;

    // 乐观更新
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsUpdating(true);

    try {
      const serverLikedState = await toggleBlogLike(blogId, user.uid);
      
      // 如果服务端结果与客户端预期不一致，以服务端为准
      if (serverLikedState !== !previousIsLiked) {
        console.log('🔄 Server state differs, updating to server state');
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
      alert('点赞失败，请重试');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className={`flex items-center space-x-2 text-muted-foreground opacity-50 ${className}`}
      >
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        <span className="text-sm font-medium">...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLike}
      disabled={!user || isUpdating}
      className={`flex items-center space-x-2 transition-all duration-200 ${
        isLiked 
          ? 'text-morandi-pink hover:text-morandi-pink-dark' 
          : 'text-morandi-gray-dark hover:text-morandi-pink'
      } ${!user ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${isUpdating ? 'opacity-75' : ''} ${className}`}
      title={!user ? 'Please login' : isLiked ? 'Unlike' : 'Like'}
    >
      <svg 
        className={`w-5 h-5 transition-all duration-200 ${
          isLiked ? 'fill-current' : 'fill-none'
        } ${isUpdating ? 'animate-pulse' : ''}`} 
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