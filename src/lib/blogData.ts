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
  FieldValue
} from 'firebase/firestore';
import { db } from './firebase';

// 评论接口
export interface Comment {
  id: string;
  blogSlug: string;
  userId: string;
  username: string;
  content: string;
  createdAt: any;
  updatedAt: any;
  likes: number;
  likedBy: string[];
}

// 点赞接口
export interface Like {
  id: string;
  blogSlug: string;
  userId: string;
  createdAt: any;
}

// 博客统计接口
export interface BlogStats {
  slug: string;
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

// 添加评论
export async function addComment(
  blogSlug: string, 
  userId: string, 
  username: string, 
  content: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      blogSlug,
      userId,
      username,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      likedBy: []
    });
    
    // 更新博客评论数
    await updateBlogStats(blogSlug, { comments: increment(1) });
    
    return docRef.id;
  } catch (error) {
    console.error('添加评论失败:', error);
    throw error;
  }
}

// 获取博客评论
export async function getBlogComments(blogSlug: string): Promise<Comment[]> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('blogSlug', '==', blogSlug),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
  } catch (error) {
    console.error('获取评论失败:', error);
    return [];
  }
}

// 删除评论
export async function deleteComment(commentId: string, blogSlug: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
    
    // 更新博客评论数
    await updateBlogStats(blogSlug, { comments: increment(-1) });
  } catch (error) {
    console.error('删除评论失败:', error);
    throw error;
  }
}

// 点赞/取消点赞博客
export async function toggleBlogLike(blogSlug: string, userId: string): Promise<boolean> {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('blogSlug', '==', blogSlug),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // 添加点赞
      await addDoc(likesRef, {
        blogSlug,
        userId,
        createdAt: serverTimestamp()
      });
      
      // 更新博客点赞数
      await updateBlogStats(blogSlug, { likes: increment(1) });
      return true;
    } else {
      // 取消点赞
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'likes', likeDoc.id));
      
      // 更新博客点赞数
      await updateBlogStats(blogSlug, { likes: increment(-1) });
      return false;
    }
  } catch (error) {
    console.error('切换点赞失败:', error);
    throw error;
  }
}

// 检查用户是否已点赞博客
export async function checkUserLikedBlog(blogSlug: string, userId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'likes'),
      where('blogSlug', '==', blogSlug),
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
export async function getBlogStats(blogSlug: string): Promise<BlogStats> {
  try {
    const docRef = doc(db, 'blogStats', blogSlug);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { slug: blogSlug, ...docSnap.data() } as BlogStats;
    } else {
      // 如果不存在，创建默认统计
      const defaultStats = {
        slug: blogSlug,
        views: 0,
        likes: 0,
        comments: 0
      };
      await updateDoc(docRef, defaultStats);
      return defaultStats;
    }
  } catch (error) {
    console.error('获取博客统计失败:', error);
    return { slug: blogSlug, views: 0, likes: 0, comments: 0 };
  }
}

// 更新博客统计信息
export async function updateBlogStats(blogSlug: string, updates: Record<string, any>): Promise<void> {
  try {
    const docRef = doc(db, 'blogStats', blogSlug);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('更新博客统计失败:', error);
    throw error;
  }
}

// 增加博客浏览量
export async function incrementBlogViews(blogSlug: string): Promise<void> {
  try {
    await updateBlogStats(blogSlug, { views: increment(1) });
  } catch (error) {
    console.error('增加浏览量失败:', error);
  }
} 