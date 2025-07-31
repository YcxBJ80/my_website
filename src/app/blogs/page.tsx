'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card'
import { Container } from '@/components/layout/Container'
import { formatDate } from '@/lib/formatDate'
import { blogHeadLine, blogIntro } from '@/config/infoConfig'
import { generateTagColor } from '@/lib/blogOperations'

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
    <div className="group relative">
      {/* Left timeline */}
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-24 text-right pr-6">
          <time
            dateTime={blog.date}
            className="text-sm font-medium text-monet-blue bg-monet-blue/10 px-3 py-1 rounded-full"
          >
            {formatDate(blog.date).split(' ')[0]}
          </time>
        </div>

        {/* Connector line */}
        <div className="flex-shrink-0 relative">
          <div className="w-4 h-4 bg-monet-blue rounded-full border-4 border-background"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-border group-last:hidden"></div>
        </div>

        {/* Blog card */}
        <div className="flex-1 ml-6">
          <Card className="hover:shadow-lg hover:shadow-monet-blue/10 transition-all duration-300 group-hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <Card.Title href={`/blogs/${blog.slug}`}>
                  <span className="group-hover:text-monet-blue transition-colors">{blog.title}</span>
                </Card.Title>
                <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
                  <span>作者: {blog.author}</span>
                  <span>•</span>
                  <span>{formatDate(blog.date)}</span>
                </div>
              </div>
            </div>

            <Card.Description>{blog.description}</Card.Description>

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
            
            {/* 统计信息和阅读全文 */}
            <div className="flex items-center justify-between">
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
                
                {/* 阅读全文按钮 */}
                <Card.Cta>
                  <span className="text-monet-blue hover:text-monet-blue-dark ml-4">阅读全文</span>
                </Card.Cta>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function BlogsIndex() {
  const [blogs, setBlogs] = useState<BlogWithStats[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    // 搜索过滤逻辑
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

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const blogsData = await response.json();
        setBlogs(blogsData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || '获取博客失败');
        console.error('获取博客失败:', response.statusText);
      }
    } catch (error) {
      console.error('加载博客失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题和描述 */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              {blogHeadLine}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {blogIntro}
            </p>
          </header>

          {/* 搜索栏 */}
          <div className="relative mb-12">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索文章标题、内容或作者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* 搜索结果计数 */}
          {searchTerm && (
            <div className="mb-6 text-sm text-muted-foreground">
              找到 {filteredBlogs.length} 篇相关文章
              {searchTerm && (
                <span className="ml-2">
                  关于 &ldquo;<span className="text-monet-blue font-medium">{searchTerm}</span>&rdquo;
                </span>
              )}
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-destructive text-sm font-medium">加载失败</span>
              </div>
              <p className="text-destructive text-sm mt-1">{error}</p>
              <button 
                onClick={loadBlogs}
                className="mt-2 text-xs text-monet-blue hover:text-monet-blue-dark transition-colors"
              >
                重新加载
              </button>
            </div>
          )}

          {/* 博客列表 */}
          <div className="relative">
            {isLoading ? (
              // 加载骨架屏
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-24 h-8 bg-muted rounded animate-pulse mr-10"></div>
                    <div className="w-4 h-4 bg-muted rounded-full mr-6"></div>
                    <div className="flex-1 bg-card border border-border rounded-xl p-6">
                      <div className="h-6 bg-muted rounded mb-3 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              // 无结果消息
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? '未找到相关文章' : '暂无文章'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? '请尝试使用其他关键词搜索' : '快来发布第一篇技术文章吧！'}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <a
                      href="/blogs/create"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-monet-blue to-monet-purple text-white rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20"
                    >
                      发布文章
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-0">
                {filteredBlogs.map((blog: BlogWithStats) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
