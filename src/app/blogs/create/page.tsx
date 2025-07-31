'use client'

import { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUserDisplayName, getUserProfile, type UserProfile } from '@/lib/user';
import { createBlog, generateTagColor, type CreateBlogData } from '@/lib/blogOperations';
import { uploadBlogImage } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css'; // KaTeX CSS

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
  id: number;
}

const predefinedTags = [
  'Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'Python', 'TensorFlow', 'PyTorch',
  'Natural Language Processing', 'Computer Vision', 'Data Science', 'Algorithms', 'Programming', 'Web Development',
  'Frontend Development', 'Backend Development', 'Mobile Development', 'Blockchain', 'Cloud Computing', 'Big Data',
  'Cybersecurity', 'Software Engineering', 'Database', 'DevOps', 'UI/UX', 'Product Design',
  'Startup', 'Tech Sharing', 'Study Notes', 'Project Experience', 'Tool Recommendations', 'Industry Insights'
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: '',
    tags: [] as string[],
  });
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const user = getCurrentUser();
  const router = useRouter();
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const blogId = Date.now().toString(); // Generate unique blog ID

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

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      alert('Please upload .md format files only');
      return;
    }

    try {
      const content = await file.text();
      setFormData(prev => ({ ...prev, content }));
      
      console.log('📄 Markdown file loaded successfully:', file.name);
    } catch (error) {
      console.error('Failed to read file:', error);
      alert('Failed to read file');
    }
  };

  // Handle multiple image upload
  const handleMultipleImageUpload = async (files: FileList) => {
    if (!user || !user.uid) {
      alert('Please log in first');
      return;
    }

    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert('Please select image files');
      return;
    }

    setUploadingImages(prev => [...prev, ...imageFiles.map(f => f.name)]);

    // Smart image insertion - find and replace placeholders
    const currentContent = formData.content || '';
    let updatedContent = currentContent;
    let hasInsertedImages = false;

    for (const file of imageFiles) {
      try {
        const imageUrl = await uploadBlogImage(file, user.uid, blogId);
        const fileName = file.name.split('.')[0]; // Remove extension
        
        // Check for Obsidian format placeholder
        const obsidianPlaceholder = `![[${fileName}]]`;
        if (currentContent.includes(obsidianPlaceholder)) {
          updatedContent = updatedContent.replace(
            obsidianPlaceholder, 
            `![${fileName}](${imageUrl})`
          );
          hasInsertedImages = true;
          console.log(`✅ Smart replacement: ${obsidianPlaceholder} → ![${fileName}](${imageUrl})`);
        }
        // Check for exact filename match
        else if (currentContent.includes(`![[${file.name}]]`)) {
          updatedContent = updatedContent.replace(
            `![[${file.name}]]`, 
            `![${fileName}](${imageUrl})`
          );
          hasInsertedImages = true;
          console.log(`✅ Smart replacement: ![[${file.name}]] → ![${fileName}](${imageUrl})`);
        }
        // If no placeholder found, don't auto-insert, let user handle manually
        else {
          console.log(`ℹ️ No placeholder found for ![[${fileName}]], please insert manually`);
        }

        // Add to uploaded images list
        setUploadedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          url: imageUrl
        }]);

      } catch (error) {
        console.error(`Image upload failed ${file.name}:`, error);
        
        // Provide user-friendly error messages
        let errorMessage = `Image upload failed: ${file.name}`;
        if (error instanceof Error && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          errorMessage += '\n\nPossible causes:\n• Browser ad blocker blocked the upload\n• Browser security settings too strict\n\nSolutions:\n• Temporarily disable ad blocker\n• Add this site to whitelist\n• Try using another browser';
        }
        alert(errorMessage);
      } finally {
        setUploadingImages(prev => prev.filter(name => name !== file.name));
      }
    }

    // Update content if any images were inserted
    if (hasInsertedImages) {
      setFormData(prev => ({ ...prev, content: updatedContent }));
    }
  };

  // Auto-convert Obsidian format to markdown
  const autoConvertObsidianToMarkdown = (content: string): string => {
    if (!content) return content;
    
    let convertedContent = content;
    const obsidianImageRegex = /!\[\[([^\]]+)\]\]/g;
    const matches = Array.from(content.matchAll(obsidianImageRegex));

    for (const match of matches) {
      const [fullMatch, fileName] = match;
      
      // Find matching uploaded image
      const matchedImage = uploadedImages.find(img => {
        const imgNameWithoutExt = img.name.split('.')[0];
        return imgNameWithoutExt === fileName || img.name === fileName;
      });

      if (matchedImage) {
        const standardMarkdown = `![${fileName}](${matchedImage.url})`;
        convertedContent = convertedContent.replace(fullMatch, standardMarkdown);
        console.log(`🔄 Auto conversion: ${fullMatch} → ${standardMarkdown}`);
      }
    }
    
    return convertedContent;
  };

  // Handle content change and auto-conversion
  const handleContentChange = (newContent: string) => {
    // First update the raw content
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Then try auto-conversion after a delay
    setTimeout(() => {
      const convertedContent = autoConvertObsidianToMarkdown(newContent);
      if (convertedContent !== newContent) {
        setFormData(prev => ({ ...prev, content: convertedContent }));
      }
    }, 500);
  };

  // Simplified image insertion - insert standard markdown format at cursor position
  const insertImageAtCursor = (imageUrl: string, imageName: string) => {
    const fileName = imageName.split('.')[0];
    const imageMarkdown = `![${fileName}](${imageUrl})`;
    const textarea = contentTextareaRef.current;
    
    if (textarea) {
      // Insert image markdown at cursor position
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = formData.content || '';
      const beforeCursor = currentContent.slice(0, start);
      const afterCursor = currentContent.slice(end);
      
      // Add appropriate line breaks
      let imageToInsert = imageMarkdown;
      if (beforeCursor && !beforeCursor.endsWith('\n')) {
        imageToInsert = '\n' + imageToInsert;
      }
      if (afterCursor && !afterCursor.startsWith('\n')) {
        imageToInsert = imageToInsert + '\n';
      }
      
      const newContent = beforeCursor + imageToInsert + afterCursor;
      setFormData(prev => ({ ...prev, content: newContent }));
      
      // Reset cursor position
      setTimeout(() => {
        const newCursorPosition = start + imageToInsert.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
      
      console.log(`✅ Image inserted at cursor position: ${fileName}`);
    } else {
      // Fallback: insert at end of content
      const currentContent = formData.content || '';
      setFormData(prev => ({
        ...prev,
        content: currentContent + '\n\n' + imageMarkdown
      }));
      console.log(`ℹ️ Unable to get cursor position, inserted at end: ${fileName}`);
    }
  };

  // Get unconverted Obsidian images
  const getUnconvertedObsidianImages = (): string[] => {
    const content = formData.content || '';
    const obsidianImageRegex = /!\[\[([^\]]+)\]\]/g;
    const unconverted: string[] = [];
    
    let match;
    while ((match = obsidianImageRegex.exec(content)) !== null) {
      const fileName = match[1];
      
      // Check if there's a matching uploaded image
      const hasMatchingImage = uploadedImages.some(img => {
        const imgNameWithoutExt = img.name.split('.')[0];
        return imgNameWithoutExt === fileName || img.name === fileName;
      });
      
      if (!hasMatchingImage) {
        unconverted.push(fileName);
      }
    }
    
    return [...new Set(unconverted)]; // Remove duplicates
  };

  const unconvertedImages = getUnconvertedObsidianImages();

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
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    if (!user) {
      alert('Please log in first');
      return;
    }

    setIsSubmitting(true);

    try {
      const blogData: CreateBlogData = {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        content: formData.content.trim(),
        tags: formData.tags || [],
        author: formData.author || getUserDisplayName(user, userProfile),
        authorId: user.uid,
      };

      const result = await createBlog(blogData);
      alert('Blog published successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        author: getUserDisplayName(user, userProfile),
        tags: [],
      });
      setUploadedImages([]);
      
      console.log('Blog published successfully:', result);
      router.push('/blogs'); // Redirect to blog list
      
    } catch (error) {
      console.error('Failed to publish blog:', error);
      alert(`Publication failed: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please log in first</h1>
          <a href="/auth" className="text-monet-blue hover:underline">Go to login</a>
        </div>
      </div>
    );
  }

  // Filter out already selected tags
  const availableTags = predefinedTags.filter(tag => !formData.tags?.includes(tag));

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Publish Blog Article</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Editing Area (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">File Upload</h3>
                
                {/* Markdown File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Upload Markdown File
                  </label>
                  <input
                    type="file"
                    accept=".md,.markdown"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-monet-blue file:text-white hover:file:bg-monet-blue-dark"
                    style={{ 
                      '--file-button-text': '"Choose File"' 
                    } as React.CSSProperties}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Upload Images (Multiple Selection)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleMultipleImageUpload(e.target.files)}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-monet-green file:text-white hover:file:bg-monet-green-dark"
                    style={{ 
                      '--file-button-text': '"Choose Files"' 
                    } as React.CSSProperties}
                  />
                </div>

                {/* Uploaded Images List */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Uploaded Images:</h4>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                          <div className="flex items-center space-x-2">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-sm text-foreground truncate">{image.name}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => insertImageAtCursor(image.url, image.name)}
                              className="px-2 py-1 text-xs bg-monet-blue text-white rounded hover:bg-monet-blue-dark transition-colors"
                              title="Smart Insert Image"
                            >
                              Insert
                            </button>
                            <button
                              type="button"
                              onClick={() => setUploadedImages(prev => prev.filter(img => img.id !== image.id))}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              title="Delete Image"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images to Upload */}
                {unconvertedImages.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
                      🔍 Images to Upload:
                    </h4>
                    <div className="space-y-1">
                      {unconvertedImages.map((fileName, index) => (
                        <div key={index} className="text-xs">
                          <span className="text-orange-500">Please upload image named &quot;{fileName}&quot;</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                      💡 After uploading corresponding named images, the system will automatically convert to standard markdown format
                    </p>
                  </div>
                )}
              </div>

              {/* Image Conversion Tip */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  💡 Write <code>![[image name]]</code> in content, upload corresponding image to auto-convert to standard markdown
                </p>
              </div>

              {/* Basic Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Basic Information</h3>
                
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog title..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of blog content..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Tags</label>
                  
                  {/* Selected Tags */}
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-monet-blue/20 text-monet-blue text-xs rounded-md"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              tags: prev.tags?.filter(t => t !== tag) || []
                            }))}
                            className="ml-1 text-monet-blue hover:text-monet-blue-dark"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Available Tags */}
                  {availableTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            tags: [...(prev.tags || []), tag]
                          }))}
                          className="px-2 py-1 text-xs border border-border text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Editing */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Content Editing</h3>
                <textarea
                  ref={contentTextareaRef}
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your Markdown content here...

# My Article Title

This is a paragraph.

![image description](image-url)

Content below the image."
                  rows={20}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent resize-none font-mono text-sm"
                />
              </div>

              {/* Publish Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-monet-blue to-monet-purple text-white py-3 px-6 rounded-lg font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Blog'}
              </button>
            </form>
          </div>

          {/* Right: Preview Area (2/3) - Height limit to match left side */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex-shrink-0">Real-time Preview</h3>
              <div className="flex-1 overflow-y-auto">
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
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">Start writing your content</p>
                      <p className="text-sm mt-2">Enter Markdown content in the left editor, and the preview will show here in real-time</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 