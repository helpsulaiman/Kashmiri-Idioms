import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { verifyAdminPassword, checkRateLimit, setSessionExpiry, clearSession, getSessionExpiry } from '../lib/adminAuth';
import Header from '../components/Header';
import AdminNav from '../components/AdminNav';
import { NextRouter } from 'next/router';
import Link from 'next/link';

// Get client IP for rate limiting
const getClientIp = () => {
  if (typeof window !== 'undefined') {
    // For local development
    return '127.0.0.1';
  }
  return 'unknown';
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check session
    const expiry = getSessionExpiry();
    if (expiry && Date.now() > parseInt(expiry)) {
      clearSession();
      router.push('/admin');
    }

    setAuthenticated(localStorage.getItem('admin-auth') === 'true');
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const clientIp = getClientIp();
      await checkRateLimit(clientIp);

      if (verifyAdminPassword(password)) {
        setAuthenticated(true);
        localStorage.setItem('admin-auth', 'true');
        setSessionExpiry();
        router.push('/dashboard');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="flex items-center justify-center py-12 px-4">
          <form 
            onSubmit={handleLogin}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-colors"
          >
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Admin Login
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <AdminNav />
      
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">ADMIN DASHBOARD</h1>
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Manage Idioms</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">Add, edit, or remove idioms from the database.</p>
          <Link 
            href="/dashboard/manage/idioms" 
            className="inline-block px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Go to Idioms
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Review Suggestions</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">Review and approve user-submitted idiom suggestions.</p>
          <Link 
            href="/dashboard/manage/suggestions" 
            className="inline-block px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
          >
            Go to Suggestions
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Change Password</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">Update your admin password.</p>
          <Link 
            href="/admin/reset" 
            className="inline-block px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}


