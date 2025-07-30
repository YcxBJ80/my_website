'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { UserProfile } from '@/components/auth/UserProfile';
import { getCurrentUser, onAuthStateChange } from '@/lib/auth';
import { Container } from '@/components/layout/Container';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // 认证成功后可以跳转到首页或其他页面
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-monet-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="py-16 flex items-center justify-center min-h-screen">
          <UserProfile />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? '欢迎回来' : '加入我们'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? '登录您的AI社团账号' : '创建您的AI社团账号'}
            </p>
          </div>

          {isLogin ? (
            <LoginForm 
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>
      </Container>
    </div>
  );
}