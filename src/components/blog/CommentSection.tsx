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
import { LikeButton } from './LikeButton';

interface CommentSectionProps {
  blogSlug: string;
}

interface CommentItemProps {
  comment: Comment;
  blogSlug: string;
  onReply: (parentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  user: any;
}

function CommentItem({ comment, blogSlug, onReply, onDelete, user }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true); // 提交回复后自动展开回复列表
    } catch (error) {
      console.error('回复失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
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
            onClick={() => onDelete(comment.id)}
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
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-4">
          {/* 回复按钮 */}
          {user && (
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-monet-blue transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span className="text-sm">回复</span>
            </button>
          )}
          
          {/* 显示回复数量和折叠/展开按钮 */}
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-monet-blue transition-colors"
            >
              <svg 
                className={`w-4 h-4 transition-transform ${showReplies ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="text-sm">
                {showReplies ? '隐藏' : '查看'} {comment.replies.length} 条回复
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 回复表单 */}
      {showReplyForm && user && (
        <form onSubmit={handleReplySubmit} className="mt-4 space-y-3 border-t border-border pt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`回复 @${comment.username}...`}
            className="w-full p-3 bg-background border border-border rounded-lg text-card-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-4 py-2 text-muted-foreground hover:text-card-foreground transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-4 py-2 rounded-lg font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '回复中...' : '回复'}
            </button>
          </div>
        </form>
      )}

      {/* 回复列表 */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pl-6 border-l-2 border-monet-blue/20 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-background/50 border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-monet-purple to-monet-pink rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {reply.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground text-sm">{reply.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {reply.createdAt ? formatDate(reply.createdAt.toDate()) : '刚刚'}
                    </p>
                  </div>
                </div>
                
                {user && user.uid === reply.userId && (
                  <button
                    onClick={() => onDelete(reply.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors p-1"
                    title="删除回复"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="text-card-foreground text-sm leading-relaxed">
                {reply.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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

    // 客户端优先：立即添加评论到UI
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      blogSlug,
      userId: user.uid,
      username: user.displayName || user.email || '用户',
      content: newComment.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    setComments(prev => [optimisticComment, ...prev]);
    setNewComment('');
    setIsSubmitting(true);

    try {
      const commentId = await addComment(blogSlug, user.uid, user.displayName || user.email || '用户', newComment.trim());
      
      // 用服务端返回的真实ID更新评论
      setComments(prev => prev.map(comment => 
        comment.id === optimisticComment.id 
          ? { ...comment, id: commentId }
          : comment
      ));
    } catch (error) {
      console.error('提交评论失败:', error);
      // 失败时移除乐观更新的评论
      setComments(prev => prev.filter(comment => comment.id !== optimisticComment.id));
      alert('评论发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!user) return;

    // 客户端优先：立即添加回复到UI
    const optimisticReply: Comment = {
      id: `temp-reply-${Date.now()}`,
      blogSlug,
      userId: user.uid,
      username: user.displayName || user.email || '用户',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      likedBy: [],
      parentId
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), optimisticReply]
        };
      }
      return comment;
    }));

    try {
      const replyId = await addComment(blogSlug, user.uid, user.displayName || user.email || '用户', content, parentId);
      
      // 用服务端返回的真实ID更新回复
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => 
              reply.id === optimisticReply.id 
                ? { ...reply, id: replyId }
                : reply
            )
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('回复失败:', error);
      // 失败时移除乐观更新的回复
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.filter(reply => reply.id !== optimisticReply.id)
          };
        }
        return comment;
      }));
      throw error;
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
    <div className="space-y-8">
      {/* 评论标题和点赞按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">
          评论 ({comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)})
        </h3>
        <LikeButton blogSlug={blogSlug} className="shrink-0" />
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
            <CommentItem
              key={comment.id}
              comment={comment}
              blogSlug={blogSlug}
              onReply={handleReply}
              onDelete={handleDeleteComment}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
} 