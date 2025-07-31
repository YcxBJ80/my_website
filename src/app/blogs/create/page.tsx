'use client'

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUserDisplayName, getUserProfile, type UserProfile } from '@/lib/user';
import { createBlog, generateTagColor } from '@/lib/blogOperations';
import { uploadBlogImage } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css'; // KaTeX CSS样式

interface BlogData {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  tags: string[];
  slug: string;
  date: string;
}

interface UploadedImage {
  name: string;
  url: string;
  id: string;
}

const predefinedTags = [
  '机器学习', '深度学习', '人工智能', 'Python', 'TensorFlow', 'PyTorch',
  '自然语言处理', '计算机视觉', '数据科学', '算法', '编程技术', 'Web开发',
  '前端开发', '后端开发', '移动开发', '区块链', '云计算', '大数据',
  '网络安全', '软件工程', '数据库', 'DevOps', 'UI/UX', '产品设计',
  '创业', '技术分享', '学习笔记', '项目经验', '工具推荐', '行业洞察'
];

// 自定义Markdown组件 - 与博客页面保持一致
const MarkdownComponents = {
  // 标题组件
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold text-foreground mt-6 mb-4 pb-2 border-b border-border" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold text-foreground mt-5 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold text-foreground mt-4 mb-2" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-lg font-medium text-foreground mt-3 mb-2" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: any) => (
    <h5 className="text-base font-medium text-foreground mt-2 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: any) => (
    <h6 className="text-sm font-medium text-foreground mt-2 mb-1" {...props}>
      {children}
    </h6>
  ),

  // 段落组件
  p: ({ children, ...props }: any) => (
    <p className="text-muted-foreground leading-relaxed mb-3" {...props}>
      {children}
    </p>
  ),

  // 图片组件
  img: ({ src, alt, ...props }: any) => (
    <div className="my-4">
      <img 
        src={src} 
        alt={alt || ''}
        className="max-w-full h-auto rounded-lg shadow-md mx-auto block"
        loading="lazy"
        {...props}
      />
      {alt && (
        <p className="text-center text-xs text-muted-foreground mt-1 italic">
          {alt}
        </p>
      )}
    </div>
  ),

  // 链接组件
  a: ({ href, children, ...props }: any) => (
    <a 
      href={href}
      className="text-monet-blue hover:text-monet-blue-dark underline underline-offset-2 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // 列表组件
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-muted-foreground mb-3 ml-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-muted-foreground mb-3 ml-4 space-y-1" {...props}>
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
    <blockquote className="border-l-4 border-monet-blue pl-3 py-2 my-3 bg-card/50 rounded-r-lg" {...props}>
      <div className="text-muted-foreground italic">
        {children}
      </div>
    </blockquote>
  ),

  // 表格组件
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-border rounded-lg text-sm" {...props}>
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
    <th className="px-3 py-2 text-left font-semibold text-foreground border-b border-border text-sm" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-3 py-2 text-muted-foreground border-b border-border/50 text-sm" {...props}>
      {children}
    </td>
  ),

  // 水平线组件
  hr: ({ ...props }: any) => (
    <hr className="my-6 border-border" {...props} />
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
      <div className="my-4">
        <SyntaxHighlighter
          style={oneDark as any}
          language={match[1]}
          PreTag="div"
          className="rounded-lg text-sm"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code 
        className="px-1.5 py-0.5 bg-card border border-border rounded text-xs font-mono text-monet-blue" 
        {...props}
      >
        {children}
      </code>
    );
  },

  // 预格式化文本
  pre: ({ children, ...props }: any) => (
    <pre className="bg-card border border-border rounded-lg p-3 overflow-x-auto my-3 text-sm" {...props}>
      {children}
    </pre>
  ),
};

export default function CreateBlogPage() {
  const [formData, setFormData] = useState<Partial<BlogData>>({
    title: '',
    description: '',
    content: '',
    author: '',
    tags: [],
  });
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const user = getCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      window.location.href = '/auth';
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        
        // 设置作者名称
        const displayName = getUserDisplayName(user, profile);
        setFormData(prev => ({ ...prev, author: displayName }));
      } catch (error) {
        console.error('获取用户资料失败:', error);
        // 如果获取失败，使用默认的显示名称
        const displayName = getUserDisplayName(user, null);
        setFormData(prev => ({ ...prev, author: displayName }));
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      alert('请上传 .md 格式的文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFormData(prev => ({ ...prev, content: content }));
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
        const blogId = Date.now().toString(); // 临时ID，实际应为创建后的博客ID
        const imageUrl = await uploadBlogImage(file, user.uid, blogId);
        
        const uploadedImage: UploadedImage = {
          name: file.name,
          url: imageUrl,
          id: imageId
        };
        setUploadedImages(prev => [...prev, uploadedImage]);

        // 智能图片插入 - 查找并替换占位符
        const fileName = file.name.split('.')[0]; // 去掉扩展名
        const placeholderPattern = new RegExp(`!\\[\\[${fileName}\\]\\]`, 'gi');
        
        setFormData(prev => {
          const currentContent = prev.content || '';
          
          // 检查是否有匹配的占位符
          if (placeholderPattern.test(currentContent)) {
            // 替换所有匹配的占位符
            const updatedContent = currentContent.replace(
              placeholderPattern, 
              `![${fileName}](${imageUrl})`
            );
            console.log(`✅ 自动替换占位符: ![[${fileName}]] → 图片链接`);
            return { ...prev, content: updatedContent };
          } else {
            // 如果没有找到占位符，不自动插入，让用户手动操作
            console.log(`ℹ️ 未找到占位符 ![[${fileName}]]，请手动插入`);
            return prev;
          }
        });
      } catch (error: any) {
        console.error(`图片上传失败 ${file.name}:`, error);
        
        // 显示详细的错误信息
        let errorMessage = `图片上传失败: ${file.name}`;
        if (error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
          errorMessage += '\n\n可能原因：\n• 浏览器广告拦截器阻止了上传\n• 浏览器安全设置过于严格\n\n解决方案：\n• 暂时禁用广告拦截器\n• 将本站添加到白名单\n• 尝试使用其他浏览器';
        } else if (error.message?.includes('网络')) {
          errorMessage += '\n\n请检查网络连接后重试';
        } else {
          errorMessage += `\n\n错误详情: ${error.message}`;
        }
        
        alert(errorMessage);
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    }
    event.target.value = ''; // Clear input
  };

  const removeImage = (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return;

    // 从content中移除对应的markdown
    const fileName = image.name.split('.')[0];
    const imageMarkdown = `![${fileName}](${image.url})`;
    setFormData(prev => ({
      ...prev,
      content: (prev.content || '').replace(imageMarkdown, '').replace(/\n{3,}/g, '\n\n')
    }));

    // 从列表中移除
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const insertImageAtCursor = (imageUrl: string, imageName: string) => {
    const fileName = imageName.split('.')[0]; // 去掉扩展名
    const imageMarkdown = `![${fileName}](${imageUrl})`;
    
    setFormData(prev => {
      const currentContent = prev.content || '';
      const placeholderPattern = new RegExp(`!\\[\\[${fileName}\\]\\]`, 'gi');
      
      // 先尝试替换占位符
      if (placeholderPattern.test(currentContent)) {
        const updatedContent = currentContent.replace(
          placeholderPattern, 
          imageMarkdown
        );
        return { ...prev, content: updatedContent };
      } else {
        // 如果没有占位符，插入到末尾
        return {
          ...prev,
          content: currentContent + '\n\n' + imageMarkdown
        };
      }
    });
  };

  // 检查内容中是否有未处理的占位符
  const getUnprocessedPlaceholders = (): string[] => {
    const content = formData.content || '';
    const placeholderRegex = /!\[\[([^\]]+)\]\]/g;
    const matches = [];
    let match;
    
    while ((match = placeholderRegex.exec(content)) !== null) {
      matches.push(match[1]); // 文件名部分
    }
    
    return matches;
  };

  // 为占位符生成建议
  const getSuggestedImages = (placeholder: string): UploadedImage[] => {
    return uploadedImages.filter(img => {
      const fileName = img.name.split('.')[0].toLowerCase();
      return fileName.includes(placeholder.toLowerCase()) || 
             placeholder.toLowerCase().includes(fileName);
    });
  };

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    if (formData.tags?.includes(tag.trim())) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag.trim()]
    }));
    setCustomTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录');
      return;
    }

    if (!formData.title?.trim() || !formData.content?.trim()) {
      alert('请填写标题和内容');
      return;
    }

    setIsSubmitting(true);

    try {
      const blogData = {
        title: formData.title!,
        description: formData.description || '',
        content: formData.content!,
        tags: formData.tags || [],
        author: formData.author || getUserDisplayName(user, userProfile),
        authorId: user.uid,
      };

      const result = await createBlog(blogData);
      alert('博客发布成功！');
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        content: '',
        author: getUserDisplayName(user, userProfile),
        tags: [],
      });
      setUploadedImages([]);
      
      console.log('博客发布成功:', result);
      router.push('/blogs'); // 跳转到博客列表页面
      
    } catch (error) {
      console.error('发布博客失败:', error);
      alert(`发布失败：${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">请先登录</h1>
          <a href="/auth" className="text-monet-blue hover:underline">前往登录</a>
        </div>
      </div>
    );
  }

  // 过滤掉已选择的标签
  const availableTags = predefinedTags.filter(tag => !formData.tags?.includes(tag));

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">发布博客文章</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：编辑区域 (2/4 = 50%) */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 文件上传 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">文件上传</h3>
                
                {/* Markdown文件上传 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    上传Markdown文件
                  </label>
                  <input
                    type="file"
                    accept=".md"
                    onChange={handleFileUpload}
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                {/* 图片上传 */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    上传图片 (可多选)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                {/* 已上传的图片列表 */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">已上传图片:</h4>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <img src={image.url} alt={image.name} className="w-12 h-12 object-cover rounded border" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate" title={image.name}>
                                {image.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {image.name.split('.')[0]} - 可用占位符: ![[{image.name.split('.')[0]}]]
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-2">
                            <button
                              type="button"
                              onClick={() => insertImageAtCursor(image.url, image.name)}
                              className="text-xs px-3 py-1.5 bg-monet-blue text-white rounded hover:bg-monet-blue-dark transition-colors"
                              title="插入到内容"
                            >
                              插入
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="text-xs px-3 py-1.5 bg-destructive text-white rounded hover:bg-destructive/80 transition-colors"
                              title="删除图片"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 占位符管理 */}
                {(() => {
                  const unprocessedPlaceholders = getUnprocessedPlaceholders();
                  return unprocessedPlaceholders.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        📍 未处理的图片占位符:
                      </h4>
                      <div className="space-y-2">
                        {unprocessedPlaceholders.map((placeholder, index) => {
                          const suggestedImages = getSuggestedImages(placeholder);
                          return (
                            <div key={index} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <code className="text-sm font-mono text-amber-800 dark:text-amber-200">
                                  ![[{placeholder}]]
                                </code>
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  等待图片
                                </span>
                              </div>
                              
                              {suggestedImages.length > 0 ? (
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground">建议匹配的图片:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {suggestedImages.map((img) => (
                                      <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => insertImageAtCursor(img.url, img.name)}
                                        className="flex items-center space-x-2 px-2 py-1 bg-monet-blue/10 hover:bg-monet-blue/20 border border-monet-blue/30 rounded text-xs transition-colors"
                                        title={`使用 ${img.name} 替换占位符`}
                                      >
                                        <img src={img.url} alt={img.name} className="w-6 h-6 object-cover rounded" />
                                        <span className="text-monet-blue">{img.name.split('.')[0]}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  上传名为 &ldquo;{placeholder}&rdquo; 的图片将自动替换此占位符
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
                    
                    {/* 快速插入说明 */}
                    <div className="mt-3 p-3 bg-monet-blue/10 border border-monet-blue/20 rounded-lg">
                      <p className="text-xs text-monet-blue font-medium mb-1">💡 智能图片插入指南：</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• <strong>占位符方式</strong>：在内容中写 <code className="bg-card px-1 rounded">![[图片名]]</code>，上传同名图片会自动替换</li>
                        <li>• <strong>手动插入</strong>：点击&ldquo;插入&rdquo;按钮将图片添加到内容中</li>
                        <li>• <strong>支持数学公式</strong>：行内公式 <code className="bg-card px-1 rounded">$E=mc^2$</code>，块级公式 <code className="bg-card px-1 rounded">{'$$\\frac{a}{b}$$'}</code></li>
                      </ul>
                    </div>

                    {/* 正在上传的提示 */}
                    {uploadingImages.size > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          <span className="text-sm text-blue-600 dark:text-blue-400">
                            正在上传 {uploadingImages.size} 张图片...
                          </span>
                        </div>
                      </div>
                    )}
              </div>

              {/* 基本信息 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">基本信息</h3>
                
                {/* 标题 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    标题 *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="输入一个吸引人的标题..."
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                    required
                  />
                </div>

                {/* 描述 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    描述
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="简短描述你的文章内容..."
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* 作者 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    作者
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    readOnly
                    className="w-full p-3 border border-border rounded-lg bg-muted text-muted-foreground"
                  />
                </div>
              </div>

              {/* 标签管理 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">标签</h3>
                
                {/* 已选择的标签 */}
                {formData.tags && formData.tags.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      已选择标签:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 text-sm rounded-full border-2 text-foreground"
                          style={{ borderColor: generateTagColor(tag) }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 预定义标签 */}
                {availableTags.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      选择标签:
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="px-3 py-1 text-sm bg-background border border-border rounded-full hover:bg-accent hover:text-monet-blue transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 自定义标签 */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    添加自定义标签:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="输入自定义标签..."
                      className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(customTag);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addTag(customTag)}
                      className="px-4 py-2 bg-monet-blue text-white rounded-lg hover:bg-monet-blue-dark transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>

              {/* 内容编辑 */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">内容编辑</h3>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="在这里编写你的Markdown内容..."
                  className="w-full h-64 p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent font-mono text-sm"
                  required
                />
              </div>

              {/* 发布按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-monet-blue to-monet-purple text-white py-3 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-monet-blue/20"
              >
                {isSubmitting ? '发布中...' : '发布博客'}
              </button>
            </form>
          </div>

          {/* 右侧：预览区域 (2/4 = 50%) */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">实时预览</h3>
              
              {formData.content ? (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={MarkdownComponents}
                  >
                    {formData.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">开始编写你的内容</p>
                  <p className="text-sm mt-2">在左侧编辑器中输入Markdown内容，这里将实时显示预览效果</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 