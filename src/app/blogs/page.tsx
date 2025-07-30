'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card'
import { Container } from '@/components/layout/Container'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'
import { blogHeadLine, blogIntro } from '@/config/infoConfig'
import { getBlogStats } from '@/lib/blogData'
import { generateTagColor } from '@/lib/blogOperations'

interface BlogWithStats extends BlogType {
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
}

function BlogCard({ blog }: { blog: BlogWithStats }) {
  return (
    <div className="group relative">
      {/* 左侧时间轴 */}
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-24 text-right pr-6">
          <time
            dateTime={blog.date}
            className="text-sm font-medium text-monet-blue bg-monet-blue/10 px-3 py-1 rounded-full"
          >
            {formatDate(blog.date).split(' ')[0]}
          </time>
        </div>
        
        {/* 连接线 */}
        <div className="flex-shrink-0 relative">
          <div className="w-4 h-4 bg-monet-blue rounded-full border-4 border-background"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-border group-last:hidden"></div>
        </div>
        
        {/* 博客卡片 */}
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
            
            {/* 标签 */}
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
            
            {/* 统计信息 */}
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
              </div>
              
              <Card.Cta>
                <span className="text-monet-blue hover:text-monet-blue-dark">阅读全文</span>
              </Card.Cta>
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

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    // 搜索过滤
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
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const blogsData = await response.json();
        
        // 加载每个博客的统计信息
        const blogsWithStats = await Promise.all(
          blogsData.map(async (blog: BlogType) => {
            try {
              const stats = await getBlogStats(blog.slug);
              return { ...blog, ...stats };
            } catch (error) {
              console.error(`获取博客 ${blog.slug} 统计失败:`, error);
              return { ...blog, views: 0, likes: 0, comments: 0 };
            }
          })
        );
        
        setBlogs(blogsWithStats);
      } else {
        console.error('获取博客失败:', response.statusText);
      }
    } catch (error) {
      console.error('加载博客失败:', error);
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

          {/* 搜索结果统计 */}
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

          {/* 博客列表 */}
          <div className="relative">
            {isLoading ? (
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
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? '未找到相关文章' : '暂无文章'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? '请尝试使用其他关键词搜索' : '快来发布第一篇技术文章吧！'}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredBlogs.map((blog: BlogWithStats) => (
                  <BlogCard key={blog.slug} blog={blog} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
