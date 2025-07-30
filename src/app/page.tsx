'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { getCurrentUser } from '@/lib/auth';

interface BlogType {
  title: string;
  description: string;
  author: string;
  date: string;
  slug: string;
}

export default function HomePage() {
  const [recentBlogs, setRecentBlogs] = useState<BlogType[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadRecentBlogs();
  }, []);

  const loadRecentBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const blogs = await response.json();
        setRecentBlogs(blogs.slice(0, 3)); // 只显示最新的3篇
      } else {
        console.error('获取博客失败:', response.statusText);
      }
    } catch (error) {
      console.error('加载博客失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: '技术博客',
      description: '分享AI学习心得、项目经验和前沿技术资讯',
      color: 'from-monet-blue to-monet-purple'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: '社区互动',
      description: '与同学们一起讨论AI话题，分享学习资源',
      color: 'from-monet-green to-monet-blue'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: '项目实践',
      description: '参与AI项目开发，提升实战能力',
      color: 'from-monet-purple to-monet-pink'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '前沿技术',
      description: '紧跟AI发展趋势，学习最新技术动态',
      color: 'from-monet-yellow to-monet-green'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 英雄区域 */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-monet-blue/10 via-background to-monet-purple/10"></div>
        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-monet-blue/20 text-monet-blue rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                欢迎来到AI社团
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                探索人工智能的
                <span className="bg-gradient-to-r from-monet-blue to-monet-purple bg-clip-text text-transparent">
                  无限可能
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                加入我们的高中AI社团，一起学习前沿技术，分享项目经验，构建属于未来的智能世界
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  href="/blogs"
                  className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-8 py-4 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20 text-lg"
                >
                  浏览博客
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-8 py-4 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20 text-lg"
                >
                  立即加入
                </Link>
              )}
              <Link
                href="/about"
                className="border border-border text-foreground px-8 py-4 rounded-xl font-medium hover:bg-accent transition-all duration-300 text-lg"
              >
                了解更多
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 功能特色 */}
      <section className="py-20 bg-card/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              社团特色
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              我们提供全方位的AI学习和实践平台，让每个成员都能在人工智能领域茁壮成长
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 最新博客 */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                最新文章
              </h2>
              <p className="text-lg text-muted-foreground">
                社团成员分享的最新技术文章和学习心得
              </p>
            </div>
            <Link
              href="/blogs"
              className="mt-6 md:mt-0 inline-flex items-center text-monet-blue hover:text-monet-blue-dark transition-colors font-medium"
            >
              查看全部
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blogs/${blog.slug}`}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span>{blog.date}</span>
                    <span className="mx-2">·</span>
                    <span>{blog.author}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-monet-blue transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="mt-4 inline-flex items-center text-monet-blue font-medium">
                    阅读更多
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">暂无文章</h3>
              <p className="text-muted-foreground">快来发布第一篇技术文章吧！</p>
            </div>
          )}
        </Container>
      </section>

      {/* CTA区域 */}
      <section className="py-20 bg-gradient-to-r from-monet-blue to-monet-purple">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好加入我们了吗？
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              与志同道合的同学一起，在AI的世界中探索、学习、成长
            </p>
            {!user && (
              <Link
                href="/auth"
                className="bg-white text-monet-blue px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg text-lg inline-flex items-center"
              >
                立即注册
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
