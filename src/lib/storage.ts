import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isConfigValid } from './firebase';

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
    
    // 上传文件
    const snapshot = await uploadBytes(imageRef, file, metadata);
    
    // 获取下载URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('图片上传失败:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('图片上传失败');
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