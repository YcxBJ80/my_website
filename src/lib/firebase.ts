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
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project' &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key_here';

// 在开发环境中提供配置提示
if (typeof window !== 'undefined' && !isConfigValid) {
  console.warn(`
🔥 Firebase配置提示：
当前使用的是默认配置，请按照以下步骤配置Firebase：

1. 访问 https://console.firebase.google.com/
2. 创建新项目或选择现有项目
3. 在项目设置 > 常规 > 您的应用 中找到配置信息
4. 将配置信息添加到 .env.local 文件中
5. 启用以下服务：
   - Authentication (身份验证)
   - Firestore Database (数据库)
   - Storage (存储)

配置文件示例：
NEXT_PUBLIC_FIREBASE_API_KEY=你的API密钥
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=你的项目ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=你的项目ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=你的项目ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=你的发送者ID
NEXT_PUBLIC_FIREBASE_APP_ID=你的应用ID
  `);
}

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
  } else {
    // 配置无效时的警告
    if (typeof window !== 'undefined') {
      console.warn('Firebase服务未初始化：请配置正确的环境变量');
    }
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
export { isConfigValid };
export default app;