'use client';
import { Heart, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function TopNavigation() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/discover" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Team Azbow</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/bookmarks"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-50 rounded-lg transition-all"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">My Bookmarks</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all outline-none"
              >
                <div className="w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <Link
                    href="/bookmarks"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Bookmarks
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}