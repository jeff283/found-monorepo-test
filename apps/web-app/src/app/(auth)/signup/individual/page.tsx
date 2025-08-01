'use client';

import React from 'react';
import {
  MailIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import AuthLayout from '@/components/authentication/AuthLayout';
import AuthHeader from '@/components/authentication/AuthHeader';
import AuthInput from '@/components/authentication/AuthInput';
import AuthBackButton from '@/components/authentication/AuthBackButton';
import FoundlyButton from '@/components/authentication/FoundlyButton';
import AuthFooter from '@/components/authentication/AuthFooter';
import SocialLoginButton from '@/components/authentication/SocialLoginButton';
import MicrosoftLogo from '@/components/microsoft-logo';
import { FcGoogle } from 'react-icons/fc';

export default function IndividualRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  // const [emailOrPhone, setEmailOrPhone] = React.useState('');
  // const [countryCode, setCountryCode] = React.useState('+1'); // Default to US
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const MIN_PASSWORD_LENGTH = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLongEnough = password.length >= MIN_PASSWORD_LENGTH;

  const requirements = [
    { label: `At least ${MIN_PASSWORD_LENGTH} characters`, met: isLongEnough },
    { label: 'One uppercase letter', met: hasUppercase },
    { label: 'One number', met: hasNumber },
    { label: 'One special character', met: hasSpecial },
  ];

  const strength = requirements.reduce((acc, req) => acc + (req.met ? 1 : 0), 0);
  const strengthLabels = ['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'];
  const strengthColors = [
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-green-600',
  ];

  const topBar = (
    <div className="flex justify-between items-center w-full">
      <AuthBackButton />
      <button className="caption text-muted-foreground hover:underline flex items-center gap-1">
        <PhoneIcon size={16} className="inline-block mr-1" />
        Contact support
      </button>
    </div>
  );

  // Simple email regex (for demo, not exhaustive)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const phoneRegex = /^\d{7,15}$/;

  const validate = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    // // Check if input is email or phone
    // const isEmail = emailRegex.test(emailOrPhone);
    // const isPhone = phoneRegex.test(emailOrPhone.replace(/[^\d]/g, ''));
    // if (!isEmail && !isPhone) {
    //   toast.error('Please enter a valid email or phone number.');
    //   return false;
    // }
    // if (isPhone && !countryCode) {
    //   toast.error('Please select a country code for your phone number.');
    //   return false;
    // }
    if (!isLongEnough) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }
    if (!hasUppercase) {
      toast.error('Password must contain at least one uppercase letter.');
      return false;
    }
    if (!hasNumber) {
      toast.error('Password must contain at least one number.');
      return false;
    }
    if (!hasSpecial) {
      toast.error('Password must contain at least one special character.');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success('Registered successfully! Please verify your email.');
      router.push(`/signup/individual/verify?email=${encodeURIComponent(email)}`);
    }, 1000);
    // // Prepare data for backend: store full E.164 phone if phone, or email
    // let contactValue = emailOrPhone;
    // const isEmail = emailRegex.test(emailOrPhone);
    // const isPhone = phoneRegex.test(emailOrPhone.replace(/[^\d]/g, ''));
    // if (isPhone) {
    //   // Remove all non-digits, prepend country code
    //   contactValue = `${countryCode}${emailOrPhone.replace(/[^\d]/g, '')}`;
    // }
    // setTimeout(() => {
    //   setLoading(false);
    //   if (isEmail) {
    //     toast.success('Registered successfully! Please verify your email.');
    //     router.push(`/signup/individual/verify?email=${encodeURIComponent(contactValue)}`);
    //   } else {
    //     toast.success('Registered successfully! Please verify your phone number.');
    //     router.push(`/signup/individual/verify?phone=${encodeURIComponent(contactValue)}`);
    //   }
    // }, 1000);
  };

  const handleSocialSignup = async (provider: 'google' | 'microsoft') => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success(`Signed up with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);
      router.push('/institution/dashboard');
    }, 1000);
  };

  return (
    <AuthLayout topBar={topBar}>
      <div className="px-4 pt-8 pb-8 min-h-screen md:flex md:items-center md:justify-center md:pt-0 md:pb-0">
        <div className="w-full max-w-[400px] mx-auto flex flex-col gap-6">
          <AuthHeader title="Register" />

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <AuthInput
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              icon={UserIcon}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <AuthInput
              id="email"
              type="email"
              placeholder="Enter your email address"
              icon={MailIcon}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          {/*
          // Email / Phone with Country Code (commented out)
          <div className="flex flex-col gap-1">
            <label htmlFor="emailOrPhone" className="text-sm font-medium text-gray-700">
              Email / Phone Number
            </label>
            <div className="flex gap-2">
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ minWidth: 80 }}
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                tabIndex={-1}
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+254">🇰🇪 +254</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+49">🇩🇪 +49</option>
              </select>
              <AuthInput
                id="emailOrPhone"
                type="text"
                placeholder="Enter your email or phone number"
                icon={MailIcon}
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                autoComplete="username"
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">If using phone, include your country code.</span>
          </div>
          */}

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative w-full">
              <AuthInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create your password"
                icon={LockIcon}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>

            {/* Password strength */}
            <div className="mt-2">
              <div className="w-full h-2 rounded bg-gray-200">
                <div
                  className={`h-2 rounded transition-all duration-300 ${strengthColors[strength]}`}
                  style={{ width: `${(strength / requirements.length) * 100}%` }}
                />
              </div>
              <div className="text-xs mt-1 text-gray-600">
                {password ? strengthLabels[strength] : 'Enter a password'}
              </div>
              <ul className="mt-2 text-xs text-gray-600 space-y-1">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className={`w-3 h-3 rounded-full flex items-center justify-center text-white text-[10px] ${req.met ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {req.met ? '✓' : ''}
                    </span>
                    <span className={req.met ? 'text-green-600' : ''}>{req.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative w-full">
              <AuthInput
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm password"
                icon={LockIcon}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <FoundlyButton
              text={loading ? 'Processing...' : 'Continue'}
              className="w-full"
              as="button"
              onClick={handleContinue}
              disabled={loading}
            />
            <p className="text-sm text-center text-gray-500 mb-1">
              Already have an account?{' '}
              <a href="/login" className="text-[#00B5C3] hover:underline">
                Sign in
              </a>
            </p>
          </div>

          {/* OR Divider */}
          <div className="relative text-center text-gray-400 my-2 sm:my-3">
            <span className="bg-white px-4 relative z-10">OR</span>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300" />
          </div>

          {/* Social Login Buttons */}
          <SocialLoginButton
            icon={FcGoogle}
            text="Sign up with Google"
            onClick={() => handleSocialSignup('google')}
          />
          <SocialLoginButton
            icon={MicrosoftLogo}
            text="Sign up with Microsoft"
            onClick={() => handleSocialSignup('microsoft')}
          />

          {/* Footer */}
          <div className="mt-0 flex justify-center">
            <AuthFooter />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
