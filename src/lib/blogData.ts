import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  increment,
  serverTimestamp,
  getDoc,
  setDoc,
  FieldValue
} from 'firebase/firestore';
import { db } from './firebase';

// 统一日期处理函数 - 与CommentSection保持一致
function getDateFromTimestamp(timestamp: any): Date {
  if (!timestamp) return new Date();
  
  // 如果是Firebase Timestamp，调用toDate()
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // 如果已经是Date对象，直接返回
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // 如果是字符串或数字，尝试转换
  return new Date(timestamp);
}

// 评论接口 - 扩展支持回复
export interface Comment {
  id: string;
  blogId: string; // 改为blogId
  userId: string;
  username: string;
  content: string;
  createdAt: any; // Can be Firebase Timestamp or Date
  updatedAt: any; // Can be Firebase Timestamp or Date
  likes: number;
  likedBy: string[];
  parentId?: string; // 父评论ID，如果为空则是顶级评论
  replies?: Comment[]; // 子回复
}

// 点赞接口
export interface Like {
  id: string;
  blogId: string; // 改为blogId
  userId: string;
  createdAt: any;
}

// 博客统计接口
export interface BlogStats {
  id: string; // 改为id，对应blogId
  views: number;
  likes: number;
  comments: number;
}

// 用于更新的博客统计接口
export interface BlogStatsUpdate {
  views?: number | FieldValue;
  likes?: number | FieldValue;
  comments?: number | FieldValue;
}

// 添加评论（支持回复）
export async function addComment(
  blogId: string, // 改为blogId
  userId: string, 
  username: string, 
  content: string,
  parentId?: string
): Promise<string> {
  try {
    const commentData: any = {
      blogId, // 改为blogId
      userId,
      username,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      likedBy: []
    };

    // 如果是回复，添加父评论ID
    if (parentId) {
      commentData.parentId = parentId;
    }

    const docRef = await addDoc(collection(db, 'comments'), commentData);
    
    // 更新博客评论数
    await updateBlogStats(blogId, { comments: increment(1) });
    
    return docRef.id;
  } catch (error) {
    console.error('添加评论失败:', error);
    throw error;
  }
}

// 获取博客评论（带回复层级结构）
export async function getBlogComments(blogId: string): Promise<Comment[]> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('blogId', '==', blogId), // 改为blogId
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const allComments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];

    // 组织评论层级结构
    const topLevelComments = allComments.filter(comment => !comment.parentId);
    const replies = allComments.filter(comment => comment.parentId);

    // 为每个顶级评论添加回复
    topLevelComments.forEach(comment => {
      comment.replies = replies
        .filter(reply => reply.parentId === comment.id)
        .sort((a, b) => {
          // 使用统一的日期处理函数
          const aTime = getDateFromTimestamp(a.createdAt);
          const bTime = getDateFromTimestamp(b.createdAt);
          return aTime.getTime() - bTime.getTime(); // 回复按时间正序
        });
    });

    return topLevelComments;
  } catch (error) {
    console.error('获取评论失败:', error);
    return [];
  }
}

// 删除评论
export async function deleteComment(commentId: string, blogId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
    // 更新博客评论数
    await updateBlogStats(blogId, { comments: increment(-1) });
  } catch (error) {
    console.error('删除评论失败:', error);
    throw error;
  }
}

// 点赞/取消点赞博客
export async function toggleBlogLike(blogId: string, userId: string): Promise<boolean> {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('blogId', '==', blogId), // 改为blogId
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // 添加点赞
      await addDoc(likesRef, {
        blogId, // 改为blogId
        userId,
        createdAt: serverTimestamp()
      });
      
      // 更新博客点赞数
      await updateBlogStats(blogId, { likes: increment(1) });
      return true;
    } else {
      // 取消点赞
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'likes', likeDoc.id));
      
      // 更新博客点赞数
      await updateBlogStats(blogId, { likes: increment(-1) });
      return false;
    }
  } catch (error) {
    console.error('切换点赞状态失败:', error);
    throw error;
  }
}

// 检查用户是否已点赞博客
export async function checkUserLikedBlog(blogId: string, userId: string): Promise<boolean> {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('blogId', '==', blogId), // 改为blogId
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('检查点赞状态失败:', error);
    return false;
  }
}

// 获取博客统计信息
export async function getBlogStats(blogId: string): Promise<BlogStats> {
  try {
    const docRef = doc(db, 'blogStats', blogId); // 使用blogId作为文档ID
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: blogId, ...docSnap.data() } as BlogStats;
    } else {
      // 如果不存在，创建默认统计
      const defaultStats = {
        id: blogId, // 改为id
        views: 0,
        likes: 0,
        comments: 0
      };
      await setDoc(docRef, defaultStats);
      return defaultStats;
    }
  } catch (error) {
    console.error('获取博客统计失败:', error);
    return { id: blogId, views: 0, likes: 0, comments: 0 };
  }
}

// 更新博客统计信息
export async function updateBlogStats(blogId: string, updates: Record<string, any>): Promise<void> {
  try {
    const docRef = doc(db, 'blogStats', blogId); // 使用blogId作为文档ID
    
    // 先检查文档是否存在
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // 如果文档不存在，先创建基础文档
      const defaultStats = {
        id: blogId, // 改为id
        views: 0,
        likes: 0,
        comments: 0
      };
      await setDoc(docRef, defaultStats);
    }
    
    // 然后更新文档
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('更新博客统计失败:', error);
    throw error;
  }
}

// 增加博客浏览量
export async function incrementBlogViews(blogId: string): Promise<void> {
  try {
    await updateBlogStats(blogId, { views: increment(1) });
  } catch (error) {
    console.error('增加浏览量失败:', error);
    throw error;
  }
} 