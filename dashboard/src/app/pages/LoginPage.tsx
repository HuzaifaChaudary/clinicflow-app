import React, { useState } from 'react';
import { auth } from '../services/api';
import { useRole } from '../context/RoleContext';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'doctor';
  clinic_id: string;
  doctor_id?: string | null;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setRole } = useRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:30',message:'handleSubmit starting',data:{email:email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      const loginResponse = await auth.login(email, password);
      console.log('Login successful, token received');
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:32',message:'Login successful',data:{hasResponse:!!loginResponse},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get user info to determine role
      try {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:38',message:'Calling getCurrentUser',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const userInfo = await auth.getCurrentUser() as UserInfo;
        console.log('User info retrieved:', userInfo);
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:40',message:'getCurrentUser success in LoginPage',data:{role:userInfo.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Set role based on user's actual role from backend
        if (userInfo.role === 'owner') {
          setRole('owner');
        } else if (userInfo.role === 'admin') {
          setRole('admin');
        } else if (userInfo.role === 'doctor') {
          setRole('doctor');
        }
        
        onLoginSuccess();
      } catch (userInfoError) {
        console.error('Error getting user info:', userInfoError);
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:52',message:'getCurrentUser error in LoginPage',data:{errorMessage:userInfoError instanceof Error?userInfoError.message:String(userInfoError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // If we can't get user info, try to proceed with default role
        // The token is valid, so we can still log in
        setRole('admin'); // Default to admin if we can't determine role
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:59',message:'Login error caught',data:{errorMessage:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError(null);
    setIsLoading(true);

    try {
      const loginResponse = await auth.login(userEmail, userPassword);
      console.log('Quick login successful, token received');
      
      // Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get user info to determine role
      try {
        const userInfo = await auth.getCurrentUser() as UserInfo;
        console.log('User info retrieved:', userInfo);
        
        if (userInfo.role === 'owner') {
          setRole('owner');
        } else if (userInfo.role === 'admin') {
          setRole('admin');
        } else if (userInfo.role === 'doctor') {
          setRole('doctor');
        }
        
        onLoginSuccess();
      } catch (userInfoError) {
        console.error('Error getting user info:', userInfoError);
        // If we can't get user info, try to proceed with default role
        // The token is valid, so we can still log in
        setRole('admin'); // Default to admin if we can't determine role
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Quick login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ClinicFlow</h1>
          <p className="text-slate-400">Sign in to your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@clinic.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Login Buttons for Development */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-500 text-center mb-4">Quick Login (Dev Only)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('owner@clinic.com', 'owner123')}
                disabled={isLoading}
                className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium rounded-lg transition-all border border-purple-500/30"
              >
                Owner
              </button>
              <button
                onClick={() => quickLogin('admin@clinic.com', 'admin123')}
                disabled={isLoading}
                className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-xs font-medium rounded-lg transition-all border border-green-500/30"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('sarah.chen@clinic.com', 'doctor123')}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium rounded-lg transition-all border border-blue-500/30"
              >
                Doctor
              </button>
            </div>
          </div>
        </div>

        {/* Credentials Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs text-slate-500 text-center mb-2">Test Credentials</p>
          <div className="text-xs text-slate-400 space-y-1">
            <p><span className="text-purple-400">Owner:</span> owner@clinic.com / owner123</p>
            <p><span className="text-green-400">Admin:</span> admin@clinic.com / admin123</p>
            <p><span className="text-blue-400">Doctor:</span> sarah.chen@clinic.com / doctor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
