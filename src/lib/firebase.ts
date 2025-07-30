import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

// 检查配置是否有效（不是默认值）
const isConfigValid = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-api-key' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project';

let app: any;
let db: any = null;
let auth: any = null;
let storage: any = null;

try {
  // 始终初始化Firebase，即使配置无效也要确保auth对象存在
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  // 只在配置有效时初始化服务
  if (isConfigValid) {
    db = getFirestore(app);
    storage = getStorage(app);
  }
  
  // 始终初始化auth，即使配置无效
  auth = getAuth(app);
  
} catch (error) {
  console.warn('Firebase初始化警告:', error);
  // 如果初始化失败，创建一个基本的auth对象避免null错误
  if (!auth) {
    // 创建一个最小的Firebase app用于auth
    try {
      const fallbackConfig = {
        apiKey: 'fallback-key',
        authDomain: 'fallback.firebaseapp.com',
        projectId: 'fallback-project',
      };
      const fallbackApp = initializeApp(fallbackConfig, 'fallback');
      auth = getAuth(fallbackApp);
    } catch (fallbackError) {
      console.error('Firebase fallback初始化失败:', fallbackError);
    }
  }
}

export { db, auth, storage };
export default app;