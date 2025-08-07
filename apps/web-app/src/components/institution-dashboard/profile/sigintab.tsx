'use client'

import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'

export default function SignInTab() {
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)

  const [email, setEmail] = useState('haguma.yy@gmail.com')
  const [password, setPassword] = useState('password123')

  return (
    <div
      className="border border-border rounded-xl p-6"
      style={{
        width: 936,
        height: 602,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
      }}
    >
      <h2 className="text-xl font-semibold text-black mb-1">Edit Sign-in Method</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Update your current sign-in method to keep your account secure and accessible.
      </p>

      <div
        style={{
          width: 886,
          height: 160,
          padding: 16,
          gap: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}
        className="border border-border rounded-xl space-y-4"
      >
        {/* Email Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-700" />
            <div>
              <p className="text-sm font-medium text-gray-800">Email Address</p>
              {isEditingEmail ? (
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-64 h-8 text-sm"
                />
              ) : (
                <p className="text-sm text-gray-400">{email}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingEmail((prev) => !prev)}
          >
            {isEditingEmail ? 'Save' : 'Change email'}
          </Button>
        </div>

        {/* Password Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-gray-700" />
            <div>
              <p className="text-sm font-medium text-gray-800">Password</p>
              {isEditingPassword ? (
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-64 h-8 text-sm"
                />
              ) : (
                <p className="text-sm text-gray-400">•••••••••••••••</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingPassword((prev) => !prev)}
          >
            {isEditingPassword ? 'Save' : 'Reset password'}
          </Button>
        </div>
      </div>
    </div>
  )
}
