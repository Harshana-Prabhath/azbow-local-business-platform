'use client';
import { ReactNode, useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { Store, Edit3, Settings, BarChart3, LogOut, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const { data: session, status } = useSession();
  
  const businessId = params?.id as string;
  const isBusinessSelected = !!businessId;
  const user = session?.user;
  const loading = status === "loading";

  const getInitials = (name?: string | null) => {
    if (!name) return "U"; 
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase(); 
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    { name: 'Profile Overview', path: `/dashboard/${businessId}`, icon: Store },
    { name: 'Edit Business', path: `/dashboard/${businessId}/edit`, icon: Edit3 },
    { name: 'Service Management', path: `/dashboard/${businessId}/services`, icon: Settings },
    
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed lg:sticky top-0 z-40 w-64 h-screen bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <Link href="/dashboard/owner" className="flex items-center space-x-2 text-[#1e3a8a]">
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-bold">Team Azbow</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (!isBusinessSelected) {
              return (
                <div key={item.name} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 cursor-not-allowed">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              );
            }

            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 px-4 py-4">
          {loading ? (
            <div className="flex items-center space-x-3 px-4 py-3 mb-2 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getInitials(user?.name || user?.email || "?")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'OWNER' ? 'Business Owner' : 'Regular User'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}