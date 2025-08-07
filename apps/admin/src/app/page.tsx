import Link from "next/link";
import { Button } from "@/admin/components/ui/button";
import { Building2, Users, Settings, BarChart3 } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export default async function AdminDashboard() {
  // Get the user object (we know it's valid because of the layout)
  const user = await currentUser();

  // Get the first name instead
  const firstName = user?.firstName || "Admin";

  const adminCards = [
    {
      title: "Institution Management",
      description: "Review and approve institution applications",
      icon: Building2,
      href: "/applications",
      color: "text-teal-600",
      bgColor: "bg-gradient-to-br from-teal-50 to-teal-100",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/users",
      color: "text-steel-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      title: "Analytics",
      description: "View platform analytics and reports",
      icon: BarChart3,
      href: "/analytics",
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    {
      title: "Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/settings",
      color: "text-gray-600",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your Foundly platform with ease
              </p>
            </div>
          </div>

          {/* Welcome message */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-sm text-teal-800">
              Welcome, {firstName}! You have access to the admin portal.
            </p>
          </div>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {adminCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link key={card.title} href={card.href}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform duration-200`}
                    >
                      <IconComponent className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Common tasks you can perform from here
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/applications">
                  <Building2 className="h-4 w-4 mr-2" />
                  Review Applications
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              >
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              >
                <Link href="/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
