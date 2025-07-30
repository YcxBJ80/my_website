'use client'

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getUserProfile, updateUserProfile, isUsernameAvailable, type UserProfile } from '@/lib/user';
import { Container } from '@/components/layout/Container';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    school: '',
    grade: '',
    interests: [] as string[]
  });
  const [newInterest, setNewInterest] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadProfile(currentUser.uid);
    } else {
      // 重定向到登录页面
      window.location.href = '/auth';
    }
  }, []);

  const loadProfile = async (uid: string) => {
    try {
      setIsLoading(true);
      const userProfile = await getUserProfile(uid);
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          username: userProfile.username || '',
          bio: userProfile.bio || '',
          school: userProfile.school || '',
          grade: userProfile.grade || '',
          interests: userProfile.interests || []
        });
      }
    } catch (error) {
      console.error('加载用户资料失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 2) {
      newErrors.username = '用户名至少需要2个字符';
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名不能超过20个字符';
    } else if (formData.username !== profile?.username) {
      const isAvailable = await isUsernameAvailable(formData.username, user?.uid);
      if (!isAvailable) {
        newErrors.username = '用户名已被使用';
      }
    }

    // 验证个人简介
    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = '个人简介不能超过200个字符';
    }

    // 验证学校
    if (formData.school && formData.school.length > 50) {
      newErrors.school = '学校名称不能超过50个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setIsSaving(true);
      await updateUserProfile(user.uid, {
        username: formData.username,
        bio: formData.bio,
        school: formData.school,
        grade: formData.grade,
        interests: formData.interests
      });
      
      // 重新加载资料
      await loadProfile(user.uid);
      setIsEditing(false);
      alert('资料更新成功！');
    } catch (error) {
      console.error('更新资料失败:', error);
      alert('更新失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        school: profile.school || '',
        grade: profile.grade || '',
        interests: profile.interests || []
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-monet-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">用户资料不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16">
        <div className="max-w-2xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">个人资料</h1>
            <p className="text-muted-foreground">管理你的个人信息和偏好设置</p>
          </div>

          {/* 资料卡片 */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* 头像和基本信息 */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-monet-green to-monet-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {profile.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-card-foreground">{profile.username}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-monet-blue/20 text-monet-blue text-xs rounded-full capitalize">
                    {profile.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    加入于 {profile.joinedAt?.toDate ? profile.joinedAt.toDate().toLocaleDateString() : '未知'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-4 py-2 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20"
              >
                {isEditing ? '取消编辑' : '编辑资料'}
              </button>
            </div>

            {/* 表单字段 */}
            <div className="space-y-4">
              {/* 用户名 */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  用户名 *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                      placeholder="输入用户名"
                    />
                    {errors.username && (
                      <p className="text-destructive text-sm mt-1">{errors.username}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-card-foreground p-3 bg-muted rounded-xl">{profile.username}</p>
                )}
              </div>

              {/* 个人简介 */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  个人简介
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent resize-none"
                      rows={3}
                      placeholder="介绍一下自己..."
                    />
                    {errors.bio && (
                      <p className="text-destructive text-sm mt-1">{errors.bio}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-card-foreground p-3 bg-muted rounded-xl min-h-[80px]">
                    {profile.bio || '暂无个人简介'}
                  </p>
                )}
              </div>

              {/* 学校 */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  学校
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                      placeholder="输入学校名称"
                    />
                    {errors.school && (
                      <p className="text-destructive text-sm mt-1">{errors.school}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-card-foreground p-3 bg-muted rounded-xl">
                    {profile.school || '未填写'}
                  </p>
                )}
              </div>

              {/* 年级 */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  年级
                </label>
                {isEditing ? (
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                  >
                    <option value="">选择年级</option>
                    <option value="高一">高一</option>
                    <option value="高二">高二</option>
                    <option value="高三">高三</option>
                  </select>
                ) : (
                  <p className="text-card-foreground p-3 bg-muted rounded-xl">
                    {profile.grade || '未填写'}
                  </p>
                )}
              </div>

              {/* 兴趣爱好 */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  兴趣爱好
                </label>
                {isEditing ? (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-3 py-1 bg-monet-blue/20 text-monet-blue rounded-full text-sm"
                        >
                          {interest}
                          <button
                            onClick={() => removeInterest(interest)}
                            className="ml-2 text-monet-blue hover:text-monet-blue-dark"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                        className="flex-1 p-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-monet-blue focus:border-transparent"
                        placeholder="添加兴趣爱好"
                      />
                      <button
                        onClick={addInterest}
                        className="px-4 py-3 bg-monet-green text-white rounded-xl hover:bg-monet-green-dark transition-colors"
                      >
                        添加
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded-xl">
                    {profile.interests && profile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 bg-monet-blue/20 text-monet-blue rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">暂无兴趣爱好</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 保存按钮 */}
            {isEditing && (
              <div className="flex space-x-3 pt-4 border-t border-border">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-monet-green to-monet-blue text-white py-3 rounded-xl font-medium hover:from-monet-green-dark hover:to-monet-blue-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-monet-green/20"
                >
                  {isSaving ? '保存中...' : '保存更改'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-border text-card-foreground rounded-xl font-medium hover:bg-accent transition-colors"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
} 