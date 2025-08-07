'use client'

import ProfileTab from './profile-tab'
import SignInTab from './sigintab'
import BillingTab from './BillingTab'

interface TabsRouterProps {
  tab: string;
}

const TabsRouter: React.FC<TabsRouterProps> = ({ tab }) => {
  if (tab === 'profile') return <ProfileTab />
  if (tab === 'billing') return <BillingTab />
  if (tab === 'signin') return <SignInTab />
  if (tab === 'privacy')
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account privacy</h2>
        <p className="text-gray-600">Privacy settings will be displayed here.</p>
      </div>
    )
  if (tab === 'logout')
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign out</h2>
        <p className="text-gray-600">Logging out...</p>
      </div>
    )
  if (tab === 'delete')
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Delete account</h2>
        <p className="text-gray-600">Account deletion warning and options will be displayed here.</p>
      </div>
    )

  return null
}

export default TabsRouter
