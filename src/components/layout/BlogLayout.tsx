'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { AppContext } from '@/app/providers'
import { Container } from '@/components/layout/Container'
import { Prose } from '@/components/shared/Prose'
import { CommentSection } from '@/components/blog/CommentSection'
import { BlogStatsComponent } from '@/components/blog/BlogStats'
import { formatDate } from '@/lib/formatDate'

interface BlogData {
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
  blog: BlogData
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
                    <time dateTime={blog.date} className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(blog.date)}
                    </time>
                    <span className="mx-3">·</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {blog.author}
                    </span>
                  </div>
                  
                  {/* 博客标签 */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-md bg-monet-blue/10 text-monet-blue border border-monet-blue/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 博客统计 */}
                  <BlogStatsComponent blogId={blog.id} />
                </div>
              </header>
              
              {/* 博客内容 */}
              <Prose>{children}</Prose>
              
              {/* 评论区域 - 现在包含点赞按钮 */}
              <div className="border-t border-border pt-8">
                <CommentSection blogId={blog.id} />
              </div>
            </article>
          </div>
        </div>
      </Container>
    </div>
  )
}
