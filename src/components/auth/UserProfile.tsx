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
            setError('Invalid Firebase configuration, please check environment variables');
            setLoading(false);
            return;
          }

          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // If user document doesn't exist, create basic user data
            setUserData({
              username: user.displayName || user.email?.split('@')[0] || 'Not set',
              email: user.email || '',
              role: 'user',
              createdAt: null
            });
          }
        } catch (error: any) {
          console.error('Failed to fetch user profile:', error);
          if (error.code === 'unavailable') {
            setError('Firebase service temporarily unavailable, please try again later');
          } else if (error.message?.includes('offline')) {
            setError('Network connection issue, please check network or Firebase configuration');
          } else {
            setError('Failed to fetch user profile, please ensure Firestore Database is enabled');
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
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 max-w-lg w-full">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 border-2 border-morandi-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Loading...</span>
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
        <div className="w-8 h-8 bg-morandi-blue rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">
            {(userData?.username || user.email)?.charAt(0).toUpperCase()}
          </span>
        </div>
        User Profile
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-destructive text-sm font-medium">Connection Error</span>
          </div>
          <p className="text-destructive text-sm mt-1">{error}</p>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Please ensure the following services are enabled in Firebase Console:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Authentication</li>
              <li>Firestore Database</li>
              <li>Storage</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="space-y-4 mb-6">
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">Username</label>
          <div className="text-card-foreground font-medium">{userData?.username || 'Not set'}</div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <div className="text-card-foreground font-medium break-all">{user.email}</div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">Role</label>
          <div className="text-card-foreground font-medium">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              userData?.role === 'admin' 
                ? 'bg-morandi-purple/10 text-morandi-purple' 
                : 'bg-morandi-blue/10 text-morandi-blue'
            }`}>
              {userData?.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3">
          <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
          <div className="text-card-foreground font-medium">
            {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString('en-US') : 'Unknown'}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-morandi-gray text-white py-3 rounded-xl font-medium hover:bg-morandi-gray-dark transition-all duration-300 shadow-lg hover:shadow-morandi-gray/20"
      >
        Sign Out
      </button>
    </div>
  );
}