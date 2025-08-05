'use client'

import { useState, useEffect, useCallback } from 'react';
import { incrementBlogViews, getBlogStats, type BlogStats } from '@/lib/blogData';

interface BlogStatsProps {
  blogId: string;
}

export function BlogStatsComponent({ blogId }: BlogStatsProps) {
  const [stats, setStats] = useState<BlogStats>({ id: blogId, views: 0, likes: 0, comments: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // 加载统计数据的函数
  const loadStats = useCallback(async () => {
    if (!blogId) return;
    
    try {
      setIsLoading(true);
      
      // 并行执行增加浏览量和获取统计数据
      const [_, blogStats] = await Promise.all([
        incrementBlogViews(blogId).catch(error => {
          console.error('Failed to increment views:', error);
        }),
        getBlogStats(blogId)
      ]);
      
      setStats(blogStats);
      setLastUpdateTime(Date.now());
      console.log(`📊 Blog stats updated for ${blogId}:`, blogStats);
    } catch (error) {
      console.error('Failed to load blog stats:', error);
      // 出错时保持当前状态，不重置为0
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  // 初始加载
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // 页面获得焦点时重新加载统计数据
  useEffect(() => {
    const handleFocus = () => {
      if (blogId) {
        console.log('🔄 Window focused, reloading blog stats');
        loadStats();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && blogId) {
        console.log('🔄 Page visible, reloading blog stats');
        loadStats();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [blogId, loadStats]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm">...</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-sm">...</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm">...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-6 text-muted-foreground">
      {/* 浏览量 */}
      <div className="flex items-center space-x-1" title={`${stats.views.toLocaleString()} views`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="text-sm font-medium">{stats.views.toLocaleString()}</span>
      </div>

      {/* 点赞数 */}
      <div className="flex items-center space-x-1" title={`${stats.likes.toLocaleString()} likes`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-sm font-medium">{stats.likes.toLocaleString()}</span>
      </div>

      {/* 评论数 */}
      <div className="flex items-center space-x-1" title={`${stats.comments.toLocaleString()} comments`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-sm font-medium">{stats.comments.toLocaleString()}</span>
      </div>
      
      {/* 最后更新时间提示 */}
      {lastUpdateTime > 0 && (
        <span className="text-xs text-muted-foreground/60">
          Updated: {new Date(lastUpdateTime).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
} 