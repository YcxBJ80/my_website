import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, isConfigValid } from '@/lib/firebase'
import { BlogLayout } from '@/components/layout/BlogLayout'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css' // KaTeX CSS样式

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

type Props = {
  params: { slug: string }
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

// 自定义Markdown组件
const MarkdownComponents = {
  // 标题组件
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl font-bold text-foreground mt-8 mb-6 pb-2 border-b border-border" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-3xl font-semibold text-foreground mt-6 mb-4" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-2xl font-semibold text-foreground mt-5 mb-3" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-xl font-medium text-foreground mt-4 mb-2" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: any) => (
    <h5 className="text-lg font-medium text-foreground mt-3 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: any) => (
    <h6 className="text-base font-medium text-foreground mt-2 mb-2" {...props}>
      {children}
    </h6>
  ),

  // 段落组件
  p: ({ children, ...props }: any) => (
    <p className="text-muted-foreground leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),

  // 图片组件
  img: ({ src, alt, ...props }: any) => (
    <div className="my-6">
      <img 
        src={src} 
        alt={alt || ''}
        className="max-w-full h-auto rounded-lg shadow-md mx-auto block"
        loading="lazy"
        {...props}
      />
      {alt && (
        <p className="text-center text-sm text-muted-foreground mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  ),

  // 链接组件
  a: ({ href, children, ...props }: any) => (
    <a 
      href={href}
      className="text-morandi-blue hover:text-morandi-blue-dark underline underline-offset-2 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // 列表组件
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-muted-foreground mb-4 ml-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  // 引用组件
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-morandi-blue pl-4 py-2 my-4 bg-card/50 rounded-r-lg" {...props}>
      <div className="text-muted-foreground italic">
        {children}
      </div>
    </blockquote>
  ),

  // 表格组件
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-border rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-card" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-4 py-2 text-left font-semibold text-foreground border-b border-border" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-2 text-muted-foreground border-b border-border/50" {...props}>
      {children}
    </td>
  ),

  // 水平线组件
  hr: ({ ...props }: any) => (
    <hr className="my-8 border-border" {...props} />
  ),

  // 强调组件
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-muted-foreground" {...props}>
      {children}
    </em>
  ),

  // 内联代码组件
  code: ({ className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !className;
    
    return !isInline && match ? (
      <div className="my-6">
        <SyntaxHighlighter
          style={oneDark as any}
          language={match[1]}
          PreTag="div"
          className="rounded-lg"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code 
                  className="px-1.5 py-0.5 bg-card border border-border rounded text-sm font-mono text-morandi-blue" 
        {...props}
      >
        {children}
      </code>
    );
  },

  // 预格式化文本
  pre: ({ children, ...props }: any) => (
    <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto my-4" {...props}>
      {children}
    </pre>
  ),
};

export default async function BlogPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug)
  
  if (!blog) {
    notFound()
  }

  return (
    <BlogLayout blog={blog}>
      <div className="mt-8 max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={MarkdownComponents}
        >
          {blog.content}
        </ReactMarkdown>
      </div>
    </BlogLayout>
  )
}