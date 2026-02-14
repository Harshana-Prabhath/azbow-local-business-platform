'use client';

import { useState } from 'react';
import { useGetBusinesses } from '@/services/businessHooks';
import { Loader2, Plus, Store, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetBusinesses(page);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500">Failed to load businesses.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
          <p className="text-gray-600 mt-1">Manage your business profiles</p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#162d6b] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Business
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.businesses.map((business) => (
          <Link
            key={business.id}
            href={`/dashboard/${business.id}`}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1e3a8a] overflow-hidden flex-shrink-0">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-6 h-6" />
                )}
              </div>
              <span className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-full">
                {business.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
              {business.name}
            </h3>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{business.location}</span>
            </div>
          </Link>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <span className="text-sm font-medium text-gray-700">
            Page {page} of {data.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}