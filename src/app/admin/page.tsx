 'use client'

import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  isRecommended: boolean;
  createdAt: any;
}

export default function AdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    isRecommended: false
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const blogsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Blog[];
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBlog() {
    try {
      await addDoc(collection(db, 'blogs'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setFormData({ title: '', content: '', author: '', isRecommended: false });
      setShowAddForm(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  }

  async function handleUpdateBlog() {
    if (!editingBlog) return;
    try {
      await updateDoc(doc(db, 'blogs', editingBlog.id), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      setEditingBlog(null);
      setFormData({ title: '', content: '', author: '', isRecommended: false });
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  }

  async function handleDeleteBlog(id: string) {
    if (!confirm('确定要删除这篇博客吗？')) return;
    try {
      await deleteDoc(doc(db, 'blogs', id));
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  async function handleToggleRecommend(id: string, currentRecommend: boolean) {
    try {
      await updateDoc(doc(db, 'blogs', id), {
        isRecommended: !currentRecommend
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling recommend:', error);
    }
  }

  function handleEdit(blog: Blog) {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      isRecommended: blog.isRecommended
    });
  }

  if (loading) return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-lg text-muted-foreground">加载中...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI社团后台管理</h1>
          <p className="text-muted-foreground">管理博客、推荐文章和评论</p>
        </div>

        {/* Add Blog Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-morandi-blue text-white px-6 py-3 rounded-xl shadow-lg hover:bg-morandi-blue-dark transition-all duration-200 font-medium"
          >
            + 添加新博客
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingBlog) && (
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {editingBlog ? '编辑博客' : '添加新博客'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-morandi-blue focus:border-transparent text-foreground"
                  placeholder="博客标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-morandi-blue focus:border-transparent text-foreground"
                  placeholder="博客内容"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">作者</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-morandi-blue focus:border-transparent text-foreground"
                  placeholder="作者姓名"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRecommended}
                  onChange={(e) => setFormData({...formData, isRecommended: e.target.checked})}
                  className="h-4 w-4 text-morandi-blue focus:ring-morandi-blue border-morandi-gray rounded"
                />
                <label className="ml-2 text-sm text-morandi-gray-dark">设为推荐文章</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={editingBlog ? handleUpdateBlog : handleAddBlog}
                  className="bg-morandi-green text-white px-6 py-2 rounded-xl hover:bg-morandi-green-dark transition-all duration-200"
                >
                  {editingBlog ? '更新' : '添加'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBlog(null);
                    setFormData({ title: '', content: '', author: '', isRecommended: false });
                  }}
                  className="bg-morandi-gray text-white px-6 py-2 rounded-xl hover:bg-morandi-gray-dark transition-all duration-200"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Table */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">博客列表</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">作者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">推荐</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {blogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-muted transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{blog.title}</div>
                      <div className="text-sm text-muted-foreground">{blog.content.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{blog.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.isRecommended 
                          ? 'bg-morandi-green/20 text-morandi-green-dark' 
                          : 'bg-morandi-gray/20 text-morandi-gray-dark'
                      }`}>
                        {blog.isRecommended ? '推荐' : '普通'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEdit(blog)}
                        className="text-morandi-blue hover:text-morandi-blue-dark bg-morandi-blue/10 hover:bg-morandi-blue/20 px-3 py-1 rounded-lg transition-colors duration-200"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleToggleRecommend(blog.id, blog.isRecommended)}
                        className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                          blog.isRecommended
                            ? 'text-morandi-yellow-dark hover:text-morandi-yellow bg-morandi-yellow/10 hover:bg-morandi-yellow/20'
                            : 'text-morandi-green-dark hover:text-morandi-green bg-morandi-green/10 hover:bg-morandi-green/20'
                        }`}
                      >
                        {blog.isRecommended ? '取消推荐' : '设为推荐'}
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-morandi-pink hover:text-morandi-pink-dark bg-morandi-pink/10 hover:bg-morandi-pink/20 px-3 py-1 rounded-lg transition-colors duration-200"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-morandi-blue">{blogs.length}</div>
            <div className="text-sm text-muted-foreground">总博客数</div>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-morandi-green">{blogs.filter(b => b.isRecommended).length}</div>
            <div className="text-sm text-muted-foreground">推荐文章</div>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-morandi-purple">{blogs.length > 0 ? Math.round(blogs.filter(b => b.isRecommended).length / blogs.length * 100) : 0}%</div>
            <div className="text-sm text-muted-foreground">推荐比例</div>
          </div>
        </div>
      </div>
    </div>
  );
}