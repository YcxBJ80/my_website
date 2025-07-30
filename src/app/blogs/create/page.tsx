'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { getCurrentUser } from '@/lib/auth';
import { createBlog } from '@/lib/blogOperations';
import { uploadBlogImage } from '@/lib/storage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BlogFormData {
  title: string;
  description: string;
  content: string;
  tags: string[];
  coverImage?: string;
}

const predefinedTags = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 
  'Python', 'AI/ML', '深度学习', '机器学习', '前端开发',
  '后端开发', '全栈开发', '数据科学', '算法', '数据结构',
  '网络安全', '区块链', '云计算', '移动开发', 'DevOps'
];

export default function CreateBlogPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    description: '',
    content: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({});
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFormData(prev => ({ ...prev, content }));
      };
      reader.readAsText(file);
    } else {
      alert('请上传 .md 格式的文件');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    try {
      const imageUrl = await uploadBlogImage(file, user.uid);
      const imageName = file.name;
      setUploadedImages(prev => ({ ...prev, [imageName]: imageUrl }));
      
      // 在markdown内容中插入图片引用
      const imageMarkdown = `![${imageName}](${imageUrl})`;
      setFormData(prev => ({
        ...prev,
        content: prev.content + '\n\n' + imageMarkdown
      }));
    } catch (error) {
      console.error('图片上传失败:', error);
      alert('图片上传失败，请重试');
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim() || !formData.content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    setIsSubmitting(true);
    try {
      await createBlog({
        title: formData.title,
        description: formData.description || formData.content.substring(0, 150) + '...',
        content: formData.content,
        tags: formData.tags,
        author: user.displayName || user.email,
        authorId: user.uid
      });

      alert('博客发布成功！');
      router.push('/blogs');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-monet-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">发布新博客</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
            {/* 左侧输入区域 (1/4) */}
            <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 文件上传 */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    上传 Markdown 文件
                  </label>
                  <input
                    type="file"
                    accept=".md,.markdown"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-monet-blue"
                  />
                </div>

                {/* 图片上传 */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    上传图片
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-monet-green"
                  />
                  {Object.keys(uploadedImages).length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      已上传: {Object.keys(uploadedImages).join(', ')}
                    </div>
                  )}
                </div>

                {/* 标题 */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    标题 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue"
                    placeholder="输入博客标题"
                    required
                  />
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue resize-none"
                    placeholder="简短描述（可选）"
                    rows={3}
                  />
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    标签
                  </label>
                  
                  {/* 已选标签 */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-monet-blue/10 text-monet-blue text-xs rounded-md"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-monet-blue/60 hover:text-monet-blue"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 添加新标签 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-monet-green"
                      placeholder="添加标签"
                    />
                    <button
                      type="button"
                      onClick={() => addTag(newTag)}
                      className="px-3 py-2 bg-monet-green text-white rounded-lg text-sm hover:bg-monet-green-dark transition-colors"
                    >
                      添加
                    </button>
                  </div>

                  {/* 预设标签 */}
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-2">常用标签:</div>
                    <div className="flex flex-wrap gap-1">
                      {predefinedTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          disabled={formData.tags.includes(tag)}
                          className="px-2 py-1 bg-background border border-border rounded text-xs text-muted-foreground hover:text-foreground hover:border-monet-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 提交按钮 */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="w-full py-3 bg-gradient-to-r from-monet-blue to-monet-purple text-white rounded-lg font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '发布中...' : '发布博客'}
                </button>
              </form>
            </div>

            {/* 右侧预览区域 (3/4) */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 overflow-y-auto">
              <div className="mb-4 pb-4 border-b border-border">
                <h2 className="text-xl font-semibold text-card-foreground mb-2">预览</h2>
                {formData.title && (
                  <h1 className="text-3xl font-bold text-foreground mb-2">{formData.title}</h1>
                )}
                {formData.description && (
                  <p className="text-muted-foreground mb-4">{formData.description}</p>
                )}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-monet-blue/10 text-monet-blue text-sm rounded-md border border-monet-blue/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                {formData.content ? (
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
                    {formData.content}
                  </ReactMarkdown>
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p>上传 Markdown 文件或直接编辑内容以查看预览</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 