import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadBlogImage(file: File, userId: string): Promise<string> {
  try {
    // 生成唯一文件名
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const imagePath = `blog-images/${userId}/${fileName}`;
    
    // 创建Storage引用
    const imageRef = ref(storage, imagePath);
    
    // 上传文件
    const snapshot = await uploadBytes(imageRef, file);
    
    // 获取下载URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('图片上传失败:', error);
    throw new Error('图片上传失败');
  }
}

export async function uploadUserAvatar(file: File, userId: string): Promise<string> {
  try {
    const imagePath = `avatars/${userId}`;
    const imageRef = ref(storage, imagePath);
    
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('头像上传失败:', error);
    throw new Error('头像上传失败');
  }
} 