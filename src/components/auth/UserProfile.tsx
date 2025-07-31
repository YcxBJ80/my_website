'use client'

import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, onAuthStateChange } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, isConfigValid } from '@/lib/firebase';

interface UserData {
  username: string;
  email: string;
  role: string;
  createdAt: any;
}

export function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      setError('');
      
      if (user) {
        try {
          if (!isConfigValid || !db) {
            setError('Firebase配置无效，请检查环境变量设置');
            setLoading(false);
            return;
          }

          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // 如果用户文档不存在，创建一个基本的用户数据
            setUserData({
              username: user.displayName || user.email?.split('@')[0] || '未设置',
              email: user.email || '',
              role: 'user',
              createdAt: null
            });
          }
        } catch (error: any) {
          console.error('获取用户资料失败:', error);
          if (error.code === 'unavailable') {
            setError('Firebase服务暂时不可用，请稍后重试');
          } else if (error.message?.includes('offline')) {
            setError('网络连接问题，请检查网络或Firebase配置');
          } else {
            setError('获取用户资料失败，请确保Firestore Database已启用');
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 max-w-lg w-full">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 border-2 border-monet-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">加载中...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg p-6 max-w-lg w-full">
      <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-monet-blue to-monet-purple rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">
            {(userData?.username || user.email)?.charAt(0).toUpperCase()}
          </span>
        </div>
        用户资料
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-destructive text-sm font-medium">连接错误</span>
          </div>
          <p className="text-destructive text-sm mt-1">{error}</p>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>请确保已在Firebase控制台启用以下服务：</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Authentication (身份验证)</li>
              <li>Firestore Database (数据库)</li>
              <li>Storage (存储)</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="space-y-4 mb-6">
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">用户名</label>
          <div className="text-card-foreground font-medium">{userData?.username || '未设置'}</div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">邮箱</label>
          <div className="text-card-foreground font-medium break-all">{user.email}</div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">角色</label>
          <div className="text-card-foreground font-medium">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              userData?.role === 'admin' 
                ? 'bg-monet-purple/10 text-monet-purple' 
                : 'bg-monet-blue/10 text-monet-blue'
            }`}>
              {userData?.role === 'admin' ? '管理员' : '用户'}
            </span>
          </div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">注册时间</label>
          <div className="text-card-foreground font-medium">
            {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString('zh-CN') : '未知'}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
      >
        登出
      </button>
    </div>
  );
}