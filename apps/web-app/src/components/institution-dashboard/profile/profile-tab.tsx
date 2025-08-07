'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Save } from 'lucide-react'

export default function ProfileTab() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  const [form, setForm] = useState({
    fullName: 'Mugisha samuel',
    email: 'Mugisha samuel',
    phone: 'Mugisha samuel',
    role: 'Senior Agent',
    country: 'United states',
    city: 'Los Angeles, California',
    address: '1234 Maple Avenue',
    zipCode: '90001',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  return (
    <div
      className="p-4"
      style={{
        width: 952,
        height: 408,
        gap: 12,
        opacity: 1,
      }}
    >
      {/* Personal Information Section */}
      <div
        style={{
          width: 952,
        //   height: 203,
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          gap: 16,
        }}
        className="border border-border mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-black">Personal information</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
          >
            {isEditingPersonal ? <Save size={16} /> : <Edit size={16} />}
            {isEditingPersonal ? 'Save' : 'Edit'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-sm text-gray-400">
              Full name
            </Label>
            <Input
              id="fullName"
              value={form.fullName}
              readOnly={!isEditingPersonal}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm text-gray-400">
              Email
            </Label>
            <Input
              id="email"
              value={form.email}
              readOnly={!isEditingPersonal}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="text-sm text-gray-400">
              Phone number
            </Label>
            <Input
              id="phone"
              value={form.phone}
              readOnly={!isEditingPersonal}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role" className="text-sm text-gray-400">
              Role
            </Label>
            <Input
              id="role"
              value={form.role}
              readOnly={!isEditingPersonal}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div
        style={{
          width: 952,
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          gap: 16,
        }}
        className="border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-black">Address</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditingAddress(!isEditingAddress)}
          >
            {isEditingAddress ? <Save size={16} /> : <Edit size={16} />}
            {isEditingAddress ? 'Save' : 'Edit'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label htmlFor="country" className="text-sm text-gray-400">
              Country
            </Label>
            <Input
              id="country"
              value={form.country}
              readOnly={!isEditingAddress}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="city" className="text-sm text-gray-400">
              City/State
            </Label>
            <Input
              id="city"
              value={form.city}
              readOnly={!isEditingAddress}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address" className="text-sm text-gray-400">
              Street address
            </Label>
            <Input
              id="address"
              value={form.address}
              readOnly={!isEditingAddress}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="zipCode" className="text-sm text-gray-400">
              Postal code
            </Label>
            <Input
              id="zipCode"
              value={form.zipCode}
              readOnly={!isEditingAddress}
              onChange={handleChange}
              className="border-none p-0 text-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}