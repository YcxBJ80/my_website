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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-lg text-gray-600">加载中...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI社团后台管理</h1>
          <p className="text-gray-600">管理博客、推荐文章和评论</p>
        </div>

        {/* Add Blog Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            + 添加新博客
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingBlog) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingBlog ? '编辑博客' : '添加新博客'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="博客标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="博客内容"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作者</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="作者姓名"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRecommended}
                  onChange={(e) => setFormData({...formData, isRecommended: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">设为推荐文章</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={editingBlog ? handleUpdateBlog : handleAddBlog}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  {editingBlog ? '更新' : '添加'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBlog(null);
                    setFormData({ title: '', content: '', author: '', isRecommended: false });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-all duration-200"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">博客列表</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推荐</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      <div className="text-sm text-gray-500">{blog.content.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blog.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.isRecommended 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.isRecommended ? '推荐' : '普通'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEdit(blog)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors duration-200"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleToggleRecommend(blog.id, blog.isRecommended)}
                        className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                          blog.isRecommended
                            ? 'text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100'
                            : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {blog.isRecommended ? '取消推荐' : '设为推荐'}
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors duration-200"
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
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-blue-600">{blogs.length}</div>
            <div className="text-sm text-gray-600">总博客数</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-green-600">{blogs.filter(b => b.isRecommended).length}</div>
            <div className="text-sm text-gray-600">推荐文章</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-purple-600">{blogs.length > 0 ? Math.round(blogs.filter(b => b.isRecommended).length / blogs.length * 100) : 0}%</div>
            <div className="text-sm text-gray-600">推荐比例</div>
          </div>
        </div>
      </div>
    </div>
  );
}