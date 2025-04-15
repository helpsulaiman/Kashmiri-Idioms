import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { verifyAdminPassword, generatePasswordHash } from '../../lib/adminAuth';
import Header from '../../components/Header';

export default function PasswordReset() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!localStorage.getItem('admin-auth')) {
      router.push('/admin');
    }
  }, [router]);

  const handleReset = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!verifyAdminPassword(currentPassword)) {
        setError('Current password is incorrect');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (newPassword.length < 12) {
        setError('New password must be at least 12 characters long');
        return;
      }

      const newHash = generatePasswordHash(newPassword);
      console.log('Add this to your .env.local:');
      console.log(`NEXT_PUBLIC_ADMIN_PASSWORD_HASH=${newHash}`);
      
      alert('Password reset instructions logged to console. Please update your .env.local file with the new hash.');
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4">
        <form 
          onSubmit={handleReset}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Reset Admin Password</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
