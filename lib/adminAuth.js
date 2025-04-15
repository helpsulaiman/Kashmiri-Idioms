import crypto from 'crypto';
import { supabase } from './supabase';

const failedAttempts = new Map();

export const verifyAdminPassword = async (inputPassword) => {
  const inputHash = crypto.createHash('sha256').update(inputPassword).digest('hex');
  return inputHash === process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH;
};

export const generatePasswordHash = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const checkRateLimit = async (ip) => {
  try {
    // Check rate limit in Supabase
    const { data: rateLimit, error } = await supabase
      .from('rate_limits')
      .select('attempts, last_attempt')
      .eq('ip', ip)
      .single();

    if (error) throw error;

    const now = new Date();
    const lastAttempt = rateLimit?.last_attempt ? new Date(rateLimit.last_attempt) : null;

    // Reset attempts if last attempt was more than 1 hour ago
    if (lastAttempt && now - lastAttempt > 3600000) {
      await supabase
        .from('rate_limits')
        .upsert({ ip, attempts: 1, last_attempt: now });
      return;
    }

    const attempts = rateLimit?.attempts || 0;
    if (attempts >= 5) {
      throw new Error('Too many attempts. Try again later.');
    }

    // Update attempts
    await supabase
      .from('rate_limits')
      .upsert({ ip, attempts: attempts + 1, last_attempt: now });
  } catch (error) {
    throw error;
  }
};

export const getSessionExpiry = () => {
  return localStorage.getItem('admin-auth-expiry');
};

export const setSessionExpiry = () => {
  const expiry = Date.now() + 3600000; // 1 hour
  localStorage.setItem('admin-auth-expiry', expiry.toString());
};

export const clearSession = () => {
  localStorage.removeItem('admin-auth');
  localStorage.removeItem('admin-auth-expiry');
};
