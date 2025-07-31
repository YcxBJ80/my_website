import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isConfigValid } from './firebase';

// 重试上传函数
async function uploadWithRetry(
  imageRef: any,
  file: File,
  metadata: any,
  maxRetries: number = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`尝试上传 (${attempt}/${maxRetries}):`, file.name);
      const snapshot = await uploadBytes(imageRef, file, metadata);
      console.log('上传成功:', file.name);
      return snapshot;
    } catch (error: any) {
      console.error(`上传失败 (尝试 ${attempt}/${maxRetries}):`, error.message);
      
      // 如果是网络错误且还有重试次数，等待后重试
      if (attempt < maxRetries && (
        error.code === 'storage/network-request-failed' ||
        error.message?.includes('ERR_BLOCKED_BY_CLIENT') ||
        error.message?.includes('network') ||
        error.message?.includes('offline')
      )) {
        const delay = Math.pow(2, attempt) * 1000; // 指数退避
        console.log(`等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // 不是网络错误或已达到最大重试次数
      throw error;
    }
  }
}

export async function uploadBlogImage(file: File, userId: string, blogId?: string): Promise<string> {
  try {
    // 检查Firebase配置
    if (!isConfigValid) {
      throw new Error('Firebase配置无效，请先配置正确的环境变量。请检查.env.local文件或在Vercel中设置环境变量。');
    }

    if (!storage) {
      throw new Error('Firebase Storage未初始化，请检查Firebase配置');
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // 按博客组织文件结构: blogs/{userId}/{blogId}/images/{fileName}
    const imagePath = blogId 
      ? `blogs/${userId}/${blogId}/images/${fileName}`
      : `blog-images/${userId}/${fileName}`;
    
    // 创建Storage引用
    const imageRef = ref(storage, imagePath);
    
    // 设置元数据
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        userId: userId,
        blogId: blogId || 'temp'
      }
    };
    
    // 使用重试机制上传文件
    const snapshot = await uploadWithRetry(imageRef, file, metadata);
    
    // 获取下载URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('图片上传完成:', file.name, '→', downloadURL);
    return downloadURL;
  } catch (error: any) {
    console.error('图片上传失败:', error);
    
    // 提供更友好的错误信息
    let errorMessage = '图片上传失败';
    if (error.code === 'storage/network-request-failed') {
      errorMessage = '网络连接失败，请检查网络或稍后重试';
    } else if (error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
      errorMessage = '上传被阻止，请检查浏览器设置或广告拦截器';
    } else if (error.code === 'storage/unauthorized') {
      errorMessage = 'Firebase存储权限不足，请检查安全规则';
    } else if (error.code === 'storage/quota-exceeded') {
      errorMessage = 'Firebase存储空间不足';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}

export async function uploadUserAvatar(file: File, userId: string): Promise<string> {
  try {
    // 检查Firebase配置
    if (!isConfigValid) {
      throw new Error('Firebase配置无效，请先配置正确的环境变量');
    }

    if (!storage) {
      throw new Error('Firebase Storage未初始化，请检查Firebase配置');
    }

    // 头像文件路径: avatars/{userId}/avatar.{extension}
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const imagePath = `avatars/${userId}/avatar.${fileExtension}`;
    const imageRef = ref(storage, imagePath);
    
    // 设置元数据
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        userId: userId
      }
    };
    
    const snapshot = await uploadBytes(imageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('头像上传失败:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('头像上传失败');
  }
}

// 新增：上传博客的markdown文件
export async function uploadBlogMarkdown(content: string, userId: string, blogId: string, fileName: string): Promise<string> {
  try {
    if (!isConfigValid || !storage) {
      throw new Error('Firebase配置无效');
    }

    // 博客markdown文件路径: blogs/{userId}/{blogId}/content/{fileName}
    const filePath = `blogs/${userId}/${blogId}/content/${fileName}`;
    const fileRef = ref(storage, filePath);
    
    // 将字符串转换为Blob
    const blob = new Blob([content], { type: 'text/markdown' });
    
    const metadata = {
      contentType: 'text/markdown',
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        userId: userId,
        blogId: blogId
      }
    };
    
    const snapshot = await uploadBytes(fileRef, blob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Markdown文件上传失败:', error);
    throw new Error('Markdown文件上传失败');
  }
}

// 新增：获取博客的所有相关文件
export async function getBlogFiles(userId: string, blogId: string) {
  try {
    if (!isConfigValid || !storage) {
      throw new Error('Firebase配置无效');
    }

    // 这里可以实现获取博客文件夹下所有文件的逻辑
    // Firebase Storage 的 listAll 功能需要在实际使用时实现
    
    return {
      images: [], // 博客的所有图片
      markdown: null, // 博客的markdown文件
      assets: [] // 其他资源文件
    };
  } catch (error) {
    console.error('获取博客文件失败:', error);
    throw new Error('获取博客文件失败');
  }
} 