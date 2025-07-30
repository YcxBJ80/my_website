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
      role: 'user',
      bio: '',
      school: '',
      grade: '',
      interests: [],
      joinedAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
      ...additionalData
    };
    
    await setDoc(userDocRef, userProfile, { merge: true });
  } catch (error) {
    console.error('创建用户资料失败:', error);
    throw error;
  }
}

// 获取用户资料
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
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
export async function updateUserProfile(
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      lastLoginAt: new Date()
    });
  } catch (error) {
    console.error('更新用户资料失败:', error);
    throw error;
  }
}

// 检查用户名是否可用
export async function isUsernameAvailable(username: string, currentUid?: string): Promise<boolean> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    // 如果没有找到用户名，说明可用
    if (querySnapshot.empty) return true;
    
    // 如果找到了，检查是否是当前用户自己的用户名
    if (currentUid) {
      return querySnapshot.docs.some(doc => doc.id === currentUid);
    }
    
    return false;
  } catch (error) {
    console.error('检查用户名可用性失败:', error);
    return false;
  }
}

// 更新用户最后登录时间
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

// 更新Firebase Auth中的用户资料
export async function updateAuthProfile(
  user: User, 
  displayName?: string, 
  photoURL?: string
): Promise<void> {
  try {
    await updateProfile(user, {
      displayName,
      photoURL
    });
  } catch (error) {
    console.error('更新Auth资料失败:', error);
    throw error;
  }
}

// 获取所有用户（仅管理员）
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data()
    })) as UserProfile[];
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