import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, isConfigValid } from '@/lib/firebase'
import { BlogLayout } from '@/components/layout/BlogLayout'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export const runtime = process.env.NEXT_RUNTIME === 'edge' ? 'edge' : 'nodejs'

interface BlogData {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  slug: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  content: string;
}

interface Props {
  params: {
    slug: string
  }
}

async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  try {
    if (!isConfigValid || !db) {
      console.error('Firebase配置无效');
      return null;
    }

    const blogsQuery = query(
      collection(db, 'blogs'),
      where('slug', '==', slug)
    );
    
    const querySnapshot = await getDocs(blogsQuery);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date?.toDate?.()?.toISOString() || data.date,
      slug: data.slug,
      tags: data.tags || [],
      views: data.views || 0,
      likes: data.likes || 0,
      comments: data.comments || 0,
      content: data.content
    };
  } catch (error) {
    console.error('获取博客失败:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) {
    return {
      title: 'Blog not found',
    }
  }

  return {
    title: blog.title,
    description: blog.description,
  }
}

export default async function BlogPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug)
  
  if (!blog) {
    notFound()
  }

  return (
    <BlogLayout blog={blog}>
      <div className="mt-8 prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !className;
              return !isInline && match ? (
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {blog.content}
        </ReactMarkdown>
      </div>
    </BlogLayout>
  )
}