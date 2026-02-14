'use client';

import { Heart, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useGetUserBookmarks, useToggleBookmark } from '@/services/userHooks';
import TopNavigation from '@/app/components/TopNavigation';

export default function BookmarksPage() {
  const { data: bookmarks, isLoading } = useGetUserBookmarks();
  const toggleBookmark = useToggleBookmark();

  if (isLoading) return <div className="flex h-screen justify-center items-center"><Loader2 className="animate-spin w-10 h-10 text-[#1e3a8a]" /></div>;

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <TopNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookmarks</h1>
        
        {!bookmarks || bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No bookmarks yet</h2>
            <p className="text-gray-600 mb-6">Save businesses to access them quickly later.</p>
            <Link href="/discover" className="inline-block px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e3a8a]/90">
              Browse Businesses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((business: any) => (
              <div key={business.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all relative">
                <button
                  onClick={() => toggleBookmark.mutate(business.id)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5 fill-[#1e3a8a] text-[#1e3a8a]" />
                </button>

                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-xl flex items-center justify-center flex-shrink-0">
                    {business.logoUrl ? (
                      <img src={business.logoUrl} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-white font-bold text-xl">{business.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{business.name}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#1e3a8a] text-xs font-semibold rounded-full">
                      {business.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{business.location}</span>
                </div>

                <Link
                  href={`/discover/${business.id}`}
                  className="block w-full py-3 text-center bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-[#1e3a8a] hover:text-white transition-all"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}