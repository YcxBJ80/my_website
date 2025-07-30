import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { createUserProfile, updateLastLoginTime, getUserProfile } from './user';

// 用户注册
export async function registerUser(
  email: string, 
  password: string,
  username?: string
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 创建用户资料
    await createUserProfile(userCredential.user, {
      username: username || email.split('@')[0]
    });
    
    return userCredential;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
}

// 用户登录
export async function loginUser(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // 更新最后登录时间
    await updateLastLoginTime(userCredential.user.uid);
    
    // 检查用户资料是否存在，如果不存在则创建
    const existingProfile = await getUserProfile(userCredential.user.uid);
    if (!existingProfile) {
      await createUserProfile(userCredential.user);
    }
    
    return userCredential;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

// 用户登出
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
}

// 获取当前用户
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// 监听用户状态变化
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// 检查用户是否已登录
export function isUserLoggedIn(): boolean {
  return auth.currentUser !== null;
}

// 检查用户是否是管理员
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.role === 'admin';
  } catch (error) {
    console.error('检查管理员权限失败:', error);
    return false;
  }
}

// 检查用户是否是版主
export async function isUserModerator(uid: string): Promise<boolean> {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.role === 'admin' || userProfile?.role === 'moderator';
  } catch (error) {
    console.error('检查版主权限失败:', error);
    return false;
  }
}