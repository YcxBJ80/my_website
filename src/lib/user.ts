import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { updateProfile, User } from 'firebase/auth';
import { db } from './firebase';

// 用户资料接口
export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  bio?: string;
  school?: string;
  grade?: string;
  interests?: string[];
  joinedAt: any;
  lastLoginAt: any;
  isActive: boolean;
}

// 获取用户显示名称的工具函数
export function getUserDisplayName(user: User | null, userProfile?: UserProfile | null): string {
  if (!user) return '匿名用户';
  
  // 优先使用用户资料中的用户名
  if (userProfile?.username) {
    return userProfile.username;
  }
  
  // 其次使用 Firebase Auth 的 displayName
  if (user.displayName) {
    return user.displayName;
  }
  
  // 最后使用邮箱的用户名部分（@ 前面的部分）
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return '用户';
}

// 异步获取用户显示名称（包含数据库查询）
export async function getUserDisplayNameAsync(user: User | null): Promise<string> {
  if (!user) return '匿名用户';
  
  try {
    // 尝试从数据库获取用户资料
    const userProfile = await getUserProfile(user.uid);
    return getUserDisplayName(user, userProfile);
  } catch (error) {
    console.warn('获取用户资料失败，使用默认显示名:', error);
    return getUserDisplayName(user, null);
  }
}

// 创建用户资料
export async function createUserProfile(
  user: User, 
  additionalData: Partial<UserProfile> = {}
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    
    const userProfile: UserProfile = {
      uid: user.uid,
      username: additionalData.username || user.displayName || user.email?.split('@')[0] || '用户',
      email: user.email || '',
      role: additionalData.role || 'user',
      avatar: additionalData.avatar || '',
      bio: additionalData.bio || '',
      school: additionalData.school || '',
      grade: additionalData.grade || '',
      interests: additionalData.interests || [],
      joinedAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
      ...additionalData
    };

    await setDoc(userDocRef, userProfile);
    console.log('用户资料创建成功');
  } catch (error) {
    console.error('创建用户资料失败:', error);
    throw error;
  }
}

// 获取用户资料
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return null;
  }
}

// 更新用户资料
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      lastLoginAt: new Date()
    });
    console.log('用户资料更新成功');
  } catch (error) {
    console.error('更新用户资料失败:', error);
    throw error;
  }
}

// 更新最后登录时间
export async function updateLastLoginTime(uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      lastLoginAt: new Date()
    });
  } catch (error) {
    console.error('更新登录时间失败:', error);
  }
}

// 检查用户名是否可用
export async function isUsernameAvailable(username: string, currentUid?: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'users'),
      where('username', '==', username)
    );
    
    const querySnapshot = await getDocs(q);
    
    // 如果没有找到任何用户，用户名可用
    if (querySnapshot.empty) {
      return true;
    }
    
    // 如果找到的是当前用户自己，也认为可用
    if (currentUid && querySnapshot.docs.length === 1) {
      const doc = querySnapshot.docs[0];
      return doc.id === currentUid;
    }
    
    return false;
  } catch (error) {
    console.error('检查用户名可用性失败:', error);
    return false;
  }
}

// 搜索用户
export async function searchUsers(searchTerm: string): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfile;
      if (
        userData.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userData.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        users.push(userData);
      }
    });
    
    return users;
  } catch (error) {
    console.error('搜索用户失败:', error);
    return [];
  }
}

// 获取所有用户（管理员用）
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    
    return users;
  } catch (error) {
    console.error('获取所有用户失败:', error);
    return [];
  }
}

// 更新用户角色（仅管理员）
export async function updateUserRole(uid: string, role: UserProfile['role']): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { role });
  } catch (error) {
    console.error('更新用户角色失败:', error);
    throw error;
  }
}

// 禁用/启用用户（仅管理员）
export async function toggleUserStatus(uid: string, isActive: boolean): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { isActive });
  } catch (error) {
    console.error('切换用户状态失败:', error);
    throw error;
  }
} 