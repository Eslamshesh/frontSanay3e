import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const VerificationContext = createContext();

export const useVerification = () => useContext(VerificationContext);

export const VerificationProvider = ({ children }) => {
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  // ✅ إرسال كود OTP عبر الباك — POST /api/auth/otp/send
  const sendVerificationCode = async (email, userName) => {
    setError('');
    setVerificationStatus('sending');
    setPendingEmail(email);
    try {
      await api.sendOtp(email);
      setVerificationStatus('sent');
      setCountdown(60);
      return true;
    } catch (err) {
      setError(err.message || 'حدث خطأ في إرسال كود التحقق');
      setVerificationStatus('idle');
      return false;
    }
  };

  // ✅ التحقق من كود OTP عبر الباك — POST /api/auth/otp/verify
  // purpose: 'register' | 'password_reset'
  const verifyCode = async (code, purpose = 'register') => {
    setError('');
    try {
      const data = await api.verifyOtp(pendingEmail, code, purpose);
      if (data?.verified) {
        setVerificationStatus('verified');

        // لو register بيرجع verified_token — خزنه عشان يتبعت مع التسجيل
        if (data.verified_token) {
          localStorage.setItem('verified_token', data.verified_token);
        }

        // لو password_reset بيرجع reset_token — خزنه عشان يتبعت مع تغيير الباسورد
        if (data.reset_token) {
          localStorage.setItem('reset_token', data.reset_token);
        }

        return true;
      }
      setError('رمز التحقق غير صحيح');
      return false;
    } catch (err) {
      setError(err.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية');
      return false;
    }
  };

  // ✅ إعادة إرسال الكود — نفس sendOtp
  const resendCode = async () => {
    setError('');
    setVerificationStatus('sending');
    try {
      await api.sendOtp(pendingEmail);
      setVerificationStatus('sent');
      setCountdown(60);
    } catch (err) {
      setError(err.message || 'حدث خطأ في إعادة إرسال الكود');
      setVerificationStatus('sent'); // نرجع لـ sent عشان المستخدم يقدر يحاول تاني
    }
  };

  const clearVerification = () => {
    setVerificationStatus('idle');
    setCountdown(0);
    setError('');
    setPendingEmail('');
    localStorage.removeItem('verified_token');
    localStorage.removeItem('reset_token');
  };

  return (
    <VerificationContext.Provider value={{
      verificationStatus, countdown, error, pendingEmail,
      sendVerificationCode, verifyCode, resendCode, clearVerification
    }}>
      {children}
    </VerificationContext.Provider>
  );
};
