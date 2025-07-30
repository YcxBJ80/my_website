'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { AppContext } from '@/app/providers'
import { Container } from '@/components/layout/Container'
import { Prose } from '@/components/shared/Prose'
import { CommentSection } from '@/components/blog/CommentSection'
import { LikeButton } from '@/components/blog/LikeButton'
import { BlogStatsComponent } from '@/components/blog/BlogStats'
import { type BlogType } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BlogLayout({
  blog,
  children,
}: {
  blog: BlogType
  children: React.ReactNode
}) {
  let router = useRouter()
  let { previousPathname } = useContext(AppContext)

  return (
    <div className="min-h-screen bg-background">
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            {previousPathname && (
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="返回博客列表"
                className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg border border-border transition-all duration-300 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 hover:bg-accent"
              >
                <ArrowLeftIcon className="h-4 w-4 stroke-muted-foreground transition group-hover:stroke-monet-blue" />
              </button>
            )}
            
            <article className="space-y-8">
              {/* 博客头部 */}
              <header className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl break-words">
                  {blog.title}
                </h1>
                
                {/* 博客元信息 */}
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center text-base text-muted-foreground">
                    <span className="h-4 w-0.5 rounded-full bg-border" />
                    <span className="ml-3">{formatDate(blog.date)}</span>
                    <span className="mx-2">·</span>
                    <span>{blog.author}</span>
                  </div>
                  
                  {/* 博客统计 */}
                  <BlogStatsComponent blogSlug={blog.slug} />
                </div>
              </header>
              
              {/* 博客内容 */}
              <Prose className="mt-8" data-mdx-content>
                {children}
              </Prose>
              
              {/* 博客操作区域 */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <LikeButton blogSlug={blog.slug} />
                    
                    {/* 分享按钮 */}
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: blog.title,
                            text: `查看这篇精彩的文章：${blog.title}`,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('链接已复制到剪贴板');
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-card border border-border text-card-foreground hover:bg-accent hover:text-monet-green transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="hidden sm:inline">分享</span>
                    </button>
                  </div>
                  
                  {/* 回到顶部按钮 */}
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-monet-blue to-monet-purple text-white hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="hidden sm:inline">回到顶部</span>
                  </button>
                </div>
              </div>
              
              {/* 评论系统 */}
              <CommentSection blogSlug={blog.slug} />
            </article>
          </div>
        </div>
      </Container>
    </div>
  )
}
