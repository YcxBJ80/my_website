'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container'
import { formatDate } from '@/lib/formatDate'
import { blogHeadLine, blogIntro } from '@/config/infoConfig'
import { generateTagColor } from '@/lib/blogOperations'
import { AnimatedList } from '@/components/ui/animated-list'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface BlogWithStats {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  slug: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
  content: string;
}

function BlogCard({ blog }: { blog: BlogWithStats }) {
  return (
    <Link 
      href={`/blogs/${blog.slug}`}
      className="group relative block cursor-pointer"
    >
      {/* Left timeline */}
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-24 text-right pr-6">
          <time
          dateTime={blog.date}
            className="text-sm font-medium text-morandi-blue bg-morandi-blue/10 px-3 py-1 rounded-full"
          >
            {formatDate(blog.date).split(' ')[0]}
          </time>
        </div>

        {/* Connector line */}
        <div className="flex-shrink-0 relative">
          <div className="w-4 h-4 bg-morandi-blue rounded-full border-4 border-background"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-border group-last:hidden"></div>
        </div>

        {/* Blog card */}
        <div className="flex-1 ml-6">
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-morandi-blue/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-morandi-blue/30">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-morandi-blue transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>By: {blog.author}</span>
                  <span>•</span>
                  <span>{formatDate(blog.date)}</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-3">
              {blog.description}
            </p>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md"
                    style={{
                      borderWidth: '1px',
                      borderColor: generateTagColor(tag),
                      color: generateTagColor(tag),
                      backgroundColor: `${generateTagColor(tag)}10`
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Statistics */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{blog.views || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{blog.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{blog.comments || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogsIndex() {
  const [blogs, setBlogs] = useState<BlogWithStats[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  // 加载博客数据的函数
  const loadBlogs = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError('');
      
      // 添加强制刷新参数和时间戳
      const timestamp = Date.now();
      const forceParam = forceRefresh ? '&force=1' : '';
      const url = `/api/blogs?t=${timestamp}${forceParam}`;
      
      console.log(`🔄 Loading blogs from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': '0',
          'If-None-Match': '',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Refresh-Timestamp': timestamp.toString(),
        }
      });
      
      if (response.ok) {
        const blogsData = await response.json();
        setBlogs(blogsData);
        setLastRefreshTime(timestamp);
        console.log('🔄 Blog data updated:', blogsData.length, 'blogs', `(timestamp: ${timestamp})`);
        
        // 详细日志：显示每个博客的信息
        blogsData.forEach((blog: any, index: number) => {
          console.log(`📄 Blog ${index + 1}: ${blog.title} (ID: ${blog.id}, Likes: ${blog.likes}, Views: ${blog.views})`);
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch blogs');
        console.error('Failed to fetch blogs:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
      setError('Network error, please try again later');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadBlogs(true); // 强制刷新初始加载
  }, [loadBlogs]);

  // 自动刷新逻辑
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Window focused, auto refreshing blog list');
      loadBlogs(true);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page visible, auto refreshing blog list');
        loadBlogs(true);
      }
    };

    // 定期刷新（每5分钟）
    const intervalId = setInterval(() => {
      console.log('🔄 Periodic refresh triggered');
      loadBlogs(false); // 非强制刷新
    }, 5 * 60 * 1000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [loadBlogs]);

  // 搜索过滤逻辑
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

  return (
    <div className="min-h-screen bg-background py-16">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {blogHeadLine}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {blogIntro}
            </p>
          </div>
        </ScrollReveal>

        {/* Search and controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-morandi-blue focus:border-transparent"
              />
            </div>
            {/* Delay notice */}
            <p className="text-xs text-morandi-gray-dark mt-2">
              💡 Blog uploads may have a 3-5 minute delay
            </p>
          </div>
          
          {/* Data status display */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground bg-card px-3 py-2 rounded-lg border border-border">
              <span className="font-medium text-foreground">{blogs.length}</span> articles
              {isLoading && <span className="text-morandi-blue ml-1">refreshing...</span>}
              {lastRefreshTime > 0 && (
                <span className="text-xs text-muted-foreground block">
                  Last updated: {new Date(lastRefreshTime).toLocaleTimeString()}
                </span>
              )}
            </div>
            
            {/* Refresh button */}
            <button
              onClick={() => loadBlogs(true)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-3 bg-morandi-blue text-white rounded-xl hover:bg-morandi-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh blog list"
            >
              <svg 
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline font-medium">
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-8 p-4 bg-morandi-pink/10 border border-morandi-pink/20 rounded-xl">
            <div className="flex items-center space-x-2 text-morandi-pink">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error: {error}</span>
            </div>
            <button 
              onClick={() => loadBlogs(true)}
              className="mt-2 text-sm text-morandi-pink hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Blog list */}
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center mb-6">
                <div className="flex-shrink-0 w-24 text-right pr-6">
                  <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="flex-shrink-0 relative">
                  <div className="w-4 h-4 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 ml-6">
                  <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <AnimatedList className="space-y-0">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </AnimatedList>
        ) : searchTerm ? (
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No matching blogs found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search terms</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-morandi-blue hover:text-morandi-blue-dark transition-colors font-medium"
              >
                Clear search
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to publish a tech article!</p>
              <Link
                href="/blogs/create"
                className="inline-flex items-center px-6 py-3 bg-morandi-blue text-white rounded-xl font-medium hover:bg-morandi-blue-dark transition-all duration-300 shadow-lg hover:shadow-morandi-blue/20"
              >
                Publish Article
              </Link>
            </div>
          </ScrollReveal>
        )}
      </Container>
      </div>
  );
}
