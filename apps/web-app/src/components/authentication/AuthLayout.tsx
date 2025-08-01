'use client'

import { ReactNode } from 'react'
import Image from 'next/image'

interface AuthLayoutProps {
  topBar?: ReactNode
  children: ReactNode
}

export default function AuthLayout({ topBar, children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary text-secondary-foreground flex-col justify-center items-center px-2 sm:px-4 md:px-6 lg:px-10 xl:px-16 2xl:px-24">
        <div className="w-full max-w-[98%] xl:max-w-[750px] flex flex-col items-start gap-6">
          <div className="w-full flex justify-center">
            <Image
              src="/Login-illustration.jpg"
              alt="Illustration"
              className="mb-6 object-cover"
              width={662}
              height={521}
              priority
              sizes="(max-width: 1512px) 80vw, 720px"
              style={{
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
                minHeight: 220,
                maxHeight: 560,
                borderRadius: 15,
                aspectRatio: '662 / 521',
                boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
                background: '#fff',
              }}
            />
          </div>

          <h1 className="headline-2 text-left text-balance w-full xl:max-w-[617px]">
            Exceptional businesses have proactive and transparent lost and found management systems.
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full xl:max-w-[662px]">
            <p className="caption text-muted text-balance leading-snug">
              Make lost &amp; found efficient and easy
            </p>
            <p className="caption text-muted text-balance leading-snug">
              Higher level of customer satisfaction
            </p>
            <p className="caption text-muted text-balance leading-snug">
              Get positive reviews and customer loyalty
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-background">
        {/* Top Bar */}
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center z-10 relative">
          {topBar}
        </div>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center w-full max-w-md mx-auto py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
