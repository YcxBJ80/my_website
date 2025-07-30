 'use client'

import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, onAuthStateChange } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('获取用户资料失败:', error);
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
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <div className="text-center text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">用户资料</h2>
      
      <div className="space-y-3 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-600">用户名</label>
          <div className="text-gray-900">{userData?.username || '未设置'}</div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">邮箱</label>
          <div className="text-gray-900">{user.email}</div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">角色</label>
          <div className="text-gray-900">{userData?.role || 'user'}</div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">注册时间</label>
          <div className="text-gray-900">
            {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : '未知'}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
      >
        登出
      </button>
    </div>
  );
}