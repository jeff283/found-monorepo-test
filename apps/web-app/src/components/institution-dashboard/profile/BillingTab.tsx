'use client'

import { Button } from '@/components/ui/button'
import { Eye, Package, X } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function BillingTab() {
  return (
    <div
      className="flex flex-col gap-[12px] w-[952px] mx-auto"
      style={{ height: 581, opacity: 1 }}
    >
      {/* Plan + Actions */}
      <div className="flex gap-[16px] w-full h-[204px]">
        {/* Left: Plan Card */}
        <div
          className="border border-border bg-white rounded-xl p-4 flex-1"
          style={{ width: 605, gap: 10 }}
        >
          <div className="space-y-1">
            <p className="text-lg text-gray-400 font-semibold">Your plan</p>
            <h2 className="text-2xl font-bold text-black">Starter plan</h2>
          </div>

          <div className="mt-4 text-base text-gray-600 flex gap-4 items-center">
            <p>Your next bill <span className="text-black font-semibold">$400</span></p>
            <p>Billing date <span className="text-black font-semibold">August 10, 2025</span></p>
          </div>

          <div className="mt-4 bg-[#f9fafb] text-[#1d4e89] text-base rounded-md p-3 font-semibold">
            No action needed — your card will be charged automatically.
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div
          className="border border-border bg-white rounded-xl p-4 flex flex-col gap-3 justify-start"
          style={{ width: 331 }}
        >
          <Button
            className="justify-start gap-[12px] text-base font-semibold" // Increased font size and weight
            variant="outline"
            style={{
              width: 299,
              height: 52,
              borderRadius: 8,
              borderWidth: 1,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 18, // Increased font size
            }}
          >
            <Eye size={16} />
            Update card
          </Button>
          <Button
            className="justify-start gap-[12px] text-base font-semibold"
            variant="outline"
            style={{
              width: 299,
              height: 52,
              borderRadius: 8,
              borderWidth: 1,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 18,
            }}
          >
            <Package size={16} />
            Manage subscription
          </Button>
          <Button
            className="justify-start gap-[12px] text-base font-semibold text-red-600 border-red-100"
            variant="outline"
            style={{
              width: 299,
              height: 52,
              borderRadius: 8,
              borderWidth: 1,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 18,
            }}
          >
            <X size={16} />
            Cancel subscription
          </Button>
        </div>
      </div>

      {/* Payment History */}
      <div
        className="border border-border bg-white rounded-xl p-4"
        style={{ width: 952, height: 365, gap: 14 }}
      >
        <h3 className="text-lg font-bold text-black mb-4">Payment history</h3>
        <div className="overflow-x-auto">
          <Table className="text-base">
            <TableHeader className="text-gray-500 bg-transparent">
              <TableRow>
                <TableHead className="font-medium text-gray-400">Date issued</TableHead>
                <TableHead className="font-medium text-gray-400">Description</TableHead>
                <TableHead className="font-medium text-gray-400">Amount</TableHead>
                <TableHead className="font-medium text-gray-400">Status</TableHead>
                <TableHead className="font-medium text-gray-400">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <TableRow key={i} className="hover:bg-muted/40">
                    <TableCell className="text-gray-800">17 Jun 2025</TableCell>
                    <TableCell className="text-gray-800">Starter Plan</TableCell>
                    <TableCell className="text-gray-800">$400</TableCell>
                    <TableCell className="text-gray-800">Paid</TableCell>
                    <TableCell>
                      <button className="text-primary font-medium">More details</button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
