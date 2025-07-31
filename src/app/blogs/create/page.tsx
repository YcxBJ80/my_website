'use client'

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUserDisplayName, getUserProfile, type UserProfile } from '@/lib/user';
import { createBlog, generateTagColor } from '@/lib/blogOperations';
import { uploadBlogImage } from '@/lib/storage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

        // 自动插入到内容中
        const imageMarkdown = `![${file.name}](${imageUrl})`;
        setFormData(prev => ({
          ...prev,
          content: (prev.content || '') + '\n\n' + imageMarkdown
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

    // 从content中移除对应的markdown
    const imageMarkdown = `![${image.name}](${image.url})`;
    setFormData(prev => ({
      ...prev,
      content: (prev.content || '').replace(imageMarkdown, '').replace(/\n{3,}/g, '\n\n')
    }));

    // 从列表中移除
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const insertImageAtCursor = (imageUrl: string, imageName: string) => {
    const imageMarkdown = `![${imageName}](${imageUrl})`;
    setFormData(prev => ({
      ...prev,
      content: (prev.content || '') + '\n\n' + imageMarkdown
    }));
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
      const slug = generateSlug(formData.title);
      const blogData = {
        title: formData.title!,
        description: formData.description || '',
        content: formData.content!,
        tags: formData.tags || [],
        slug,
        date: new Date().toISOString(),
        author: formData.author || getUserDisplayName(user, userProfile),
        authorId: user.uid,
      };

      await createBlog(blogData);
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
      
    } catch (error) {
      console.error('发布博客失败:', error);
      alert('发布失败，请重试');
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
          {/* 左侧：编辑区域 (1/4) */}
          <div className="lg:col-span-1 space-y-6">
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
                    <div className="space-y-2">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="flex items-center justify-between bg-background/50 p-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <img src={image.url} alt={image.name} className="w-8 h-8 object-cover rounded" />
                            <span className="text-xs text-foreground truncate max-w-20" title={image.name}>
                              {image.name}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => insertImageAtCursor(image.url, image.name)}
                              className="text-xs px-2 py-1 bg-monet-blue text-white rounded hover:bg-monet-blue-dark"
                              title="插入到内容"
                            >
                              插入
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="text-xs px-2 py-1 bg-destructive text-white rounded hover:bg-destructive/80"
                              title="删除"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 正在上传的提示 */}
                {uploadingImages.size > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    正在上传 {uploadingImages.size} 张图片...
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

          {/* 右侧：预览区域 (3/4) */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">实时预览</h3>
              
              {formData.content ? (
                <div className="prose prose-invert max-w-none">
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