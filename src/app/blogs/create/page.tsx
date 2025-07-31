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

interface UploadedImage {
  name: string;
  url: string;
  id: string;
}

const predefinedTags = [
  'AI', '机器学习', '深度学习', '神经网络', 'Python', 'TensorFlow', 'PyTorch',
  '自然语言处理', '计算机视觉', '数据科学', '算法', '编程', '项目分享', '学习心得'
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
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
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

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        content: content
      }));
    };
    reader.readAsText(file);
  };

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} 不是图片文件`);
        continue;
      }

      const imageId = `${file.name}-${Date.now()}`;
      setUploadingImages(prev => new Set(prev).add(imageId));

      try {
        // 上传到Firebase Storage，使用博客特定的路径
        const blogId = Date.now().toString(); // 临时ID，实际应该是博客创建后的ID
        const imageUrl = await uploadBlogImage(file, user.uid, blogId);
        
        const uploadedImage: UploadedImage = {
          name: file.name,
          url: imageUrl,
          id: imageId
        };

        setUploadedImages(prev => [...prev, uploadedImage]);
        
        // 在markdown内容中插入图片引用
        const imageMarkdown = `![${file.name}](${imageUrl})`;
        setFormData(prev => ({
          ...prev,
          content: prev.content + '\n\n' + imageMarkdown
        }));

      } catch (error) {
        console.error(`图片上传失败 ${file.name}:`, error);
        alert(`图片上传失败: ${file.name}`);
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    }

    // 清空input
    event.target.value = '';
  };

  const removeImage = (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;

    // 从content中移除图片引用
    const imageMarkdown = `![${image.name}](${image.url})`;
    setFormData(prev => ({
      ...prev,
      content: prev.content.replace(imageMarkdown, '').replace(/\n{3,}/g, '\n\n')
    }));

    // 从上传列表中移除
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const insertImageAtCursor = (imageUrl: string, imageName: string) => {
    const imageMarkdown = `![${imageName}](${imageUrl})`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n\n' + imageMarkdown
    }));
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
        description: formData.description,
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

                {/* 多图片上传 */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    上传图片 (支持多选)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-monet-green"
                  />
                  
                  {/* 上传进度 */}
                  {uploadingImages.size > 0 && (
                    <div className="mt-2 text-xs text-monet-blue">
                      正在上传 {uploadingImages.size} 张图片...
                    </div>
                  )}

                  {/* 已上传的图片列表 */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-card-foreground">已上传的图片:</div>
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="flex items-center justify-between bg-background rounded p-2">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={image.url} 
                              alt={image.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-xs text-muted-foreground truncate">
                              {image.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => insertImageAtCursor(image.url, image.name)}
                              className="text-xs text-monet-blue hover:text-monet-blue-dark"
                              title="插入到内容"
                            >
                              插入
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="text-xs text-red-500 hover:text-red-700"
                              title="删除图片"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
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
                    placeholder="请输入博客标题"
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
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue"
                    placeholder="请输入博客描述"
                    rows={3}
                  />
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">标签</label>
                  
                  {/* 已选标签 */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-monet-blue/20 text-monet-blue rounded-md text-xs"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
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
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-monet-blue"
                      placeholder="输入标签名称"
                    />
                    <button
                      type="button"
                      onClick={() => addTag(newTag)}
                      className="px-3 py-2 bg-monet-blue text-white rounded-lg text-sm hover:bg-monet-blue-dark transition-colors"
                    >
                      添加
                    </button>
                  </div>

                  {/* 预定义标签 */}
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-2">快速添加:</div>
                    <div className="flex flex-wrap gap-1">
                      {predefinedTags.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs hover:bg-monet-blue hover:text-white transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 发布按钮 */}
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
                        className="px-2 py-1 bg-monet-blue/20 text-monet-blue rounded-md text-sm"
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
                  <div className="text-center py-20 text-muted-foreground">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg">在左侧输入内容或上传 Markdown 文件开始编写博客</p>
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