import { SignOutButton } from "@clerk/nextjs";
import { ShieldXIcon, MailIcon } from "lucide-react";
import FoundlyButton from "@/admin/components/custom/FoundlyButton";
import { currentUser } from "@clerk/nextjs/server";
export default async function UnauthorizedPage() {
  const user = await currentUser();

  // Get the primary email address
  const primaryEmail = user?.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  );
  const userEmail = primaryEmail?.emailAddress;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <ShieldXIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            This admin portal is restricted to Foundly team members only.
          </p>
        </div>

        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 mb-3">
            Only email addresses with the <strong>@foundlyhq.com</strong> domain
            are authorized to access this system.
          </p>
          {userEmail && (
            <div className="flex items-center justify-center gap-2 p-2 bg-red-100 rounded border border-red-300">
              <MailIcon size={14} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Attempted access with: {userEmail}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <SignOutButton>
            <FoundlyButton as="button" className="w-full" variant="outline">
              <span>
                {/* <LogOutIcon size={16} className="mr-2" /> */}
                Sign Out
              </span>
            </FoundlyButton>
          </SignOutButton>

          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact the system
            administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
