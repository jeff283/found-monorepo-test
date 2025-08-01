'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PhoneIcon } from 'lucide-react';

import { toast } from 'sonner'; // ✅ Sonner toast

import AuthLayout from '@/components/authentication/AuthLayout';
import AuthBackButton from '@/components/authentication/AuthBackButton';
import FoundlyButton from '@/components/authentication/FoundlyButton';
import AuthFooter from '@/components/authentication/AuthFooter';
import images from '@/constants/images';

// --- mock backend (replace later) ---
async function verifyEmailOtp(otp: string[]) {
  return Promise.resolve({ success: otp.join('') === '1234' });
}
async function resendEmailOtp() {
  return Promise.resolve({ success: true });
}

const IndividualVerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get('email');
  const email = rawEmail?.replace(/^["']|["']$/g, '') ?? 'your email';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(120);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    setError('');
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    if (otp.some((digit) => digit === '')) {
      setError('Please enter all 4 digits.');
      return;
    }

    setIsVerifying(true);
    const result = await verifyEmailOtp(otp);
    setIsVerifying(false);

    if (result.success) {
      toast.success('Verification successful! Redirecting...');
      setTimeout(() => {
        router.push('/institution/dashboard');
      }, 1500);
    } else {
      toast.error('Invalid code. Please try again.');
    }
  };

  const handleResend = async () => {
    const result = await resendEmailOtp();
    if (result.success) {
      setOtp(['', '', '', '']);
      setSeconds(120);
      inputRefs.current[0]?.focus();
      setError('');
      toast.success('Verification code resent.');
    } else {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return (
    <>
      <div className="px-4 pt-8 pb-8 min-h-screen md:flex md:items-center md:justify-center">
        <div className="w-full max-w-md mx-auto flex flex-col gap-8 text-center">
          <div className="flex justify-center gap-2">
            <Image src={images.logo} alt="Foundly Logo" width={48} height={48} />
          </div>

          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-xl font-semibold">Email Verification</h1>
            <p className="text-sm text-muted-foreground">
              Enter the 4-digit code sent to your email: <br />
              <span className="font-medium text-black">{email}</span>
            </p>
          </div>

          <div className="flex justify-center gap-3 max-w-[300px] mx-auto">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="tel"
                maxLength={1}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                disabled={isVerifying}
                aria-label={`OTP Digit ${i + 1}`}
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            ))}
          </div>

          <div className="text-sm text-muted-foreground flex flex-col items-center gap-2">
            <p>
              Code expires in <span className="text-black font-medium">{formatTime(seconds)}</span>
            </p>
            <p>
              Didn’t receive a code?{' '}
              <button
                onClick={handleResend}
                className="text-[#00B5C3] hover:underline font-medium"
              >
                Resend code
              </button>
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="w-full flex justify-center">
            <FoundlyButton
              text={isVerifying ? 'Verifying...' : 'Continue'}
              className="w-full max-w-[300px]"
              as="button"
              onClick={handleVerify}
              disabled={isVerifying}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 items-center mt-8">
        <AuthFooter />
      </div>
    </>
  );
};

const topBar = (
  <div className="flex justify-between items-center w-full px-2">
    <AuthBackButton />
    <button className="caption text-muted-foreground hover:underline flex items-center gap-1">
      <PhoneIcon size={16} /> Contact support
    </button>
  </div>
);

export default function IndividualVerificationPage() {
  return (
    <AuthLayout topBar={topBar}>
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <IndividualVerificationContent />
      </Suspense>
    </AuthLayout>
  );
}
