'use client'

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { 
  addComment, 
  getBlogComments, 
  deleteComment,
  type Comment 
} from '@/lib/blogData';
import { formatDate } from '@/lib/formatDate';

interface CommentSectionProps {
  blogSlug: string;
}

export function CommentSection({ blogSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    loadComments();
  }, [blogSlug]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await getBlogComments(blogSlug);
      setComments(fetchedComments);
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录后再评论');
      return;
    }

    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    try {
      setIsSubmitting(true);
      await addComment(blogSlug, user.uid, user.email || '匿名用户', newComment.trim());
      setNewComment('');
      await loadComments(); // 重新加载评论
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('提交评论失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    if (confirm('确定要删除这条评论吗？')) {
      try {
        await deleteComment(commentId, blogSlug);
        await loadComments();
      } catch (error) {
        console.error('删除评论失败:', error);
        alert('删除评论失败');
      }
    }
  };

  return (
    <div className="mt-12 space-y-8">
      {/* 评论标题 */}
      <div className="border-t border-white/10 pt-8">
        <h3 className="text-2xl font-bold text-white mb-6">
          评论 ({comments.length})
        </h3>
      </div>

      {/* 添加评论表单 */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享你的想法..."
              className="w-full p-4 bg-card border border-border rounded-xl text-card-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-6 py-2 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-monet-blue/20"
            >
              {isSubmitting ? '发布中...' : '发布评论'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-muted-foreground mb-4">请登录后参与评论</p>
          <a
            href="/auth"
            className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-6 py-2 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 inline-block shadow-lg hover:shadow-monet-blue/20"
          >
            立即登录
          </a>
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">加载评论中...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无评论，快来发表第一条评论吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              {/* 评论头部 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-monet-green to-monet-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {comment.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{comment.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {comment.createdAt ? formatDate(comment.createdAt.toDate()) : '刚刚'}
                    </p>
                  </div>
                </div>
                
                {/* 删除按钮（仅作者可见） */}
                {user && user.uid === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors p-2"
                    title="删除评论"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* 评论内容 */}
              <div className="text-card-foreground leading-relaxed">
                {comment.content}
              </div>

              {/* 评论操作 */}
              <div className="flex items-center space-x-4 pt-2">
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-monet-blue transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm">{comment.likes || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 