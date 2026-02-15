'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Heart, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchBusinesses, useToggleBookmark } from '@/services/userHooks';
import { useDebounce } from 'use-debounce';
import TopNavigation from '@/app/components/TopNavigation';

const districts = [
  'All Locations', 'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 
  'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const categories = ['All', 'Food & Beverage', 'Retail', 'Technology', 'Health & wellness', 'Services'];

export default function UserDiscoveryDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useSearchBusinesses({
    query: debouncedQuery,
    category: selectedCategory,
    location: selectedLocation,
    page: currentPage,
  });

  const toggleBookmark = useToggleBookmark();

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedCategory, selectedLocation]);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <TopNavigation />
      
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Discover Local Businesses</h1>
            <p className="text-lg text-gray-600">Find the best services and businesses in your area</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for businesses or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-gray-900"
                />
              </div>

              <div className="relative min-w-[220px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none text-gray-900 bg-white appearance-none cursor-pointer"
                >
                  {districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <button className="px-8 py-3.5 bg-[#1e3a8a] text-white rounded-xl font-semibold hover:bg-[#1e3a8a]/90 transition-all shadow-sm">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category ? 'bg-[#1e3a8a] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{data?.totalCount || 0} Businesses Found</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-[#1e3a8a]" /></div>
        ) : !data?.businesses.length ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.businesses.map((business: any) => (
              <div key={business.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all relative flex flex-col h-full">
                <button
                  onClick={() => toggleBookmark.mutate(business.id)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
                >
                  <Heart className={`w-5 h-5 ${business.isBookmarked ? 'fill-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-400'}`} />
                </button>

                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl overflow-hidden">
                    {business.logoUrl ? (
                      <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                    ) : (
                      business.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate" title={business.name}>{business.name}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#1e3a8a] text-xs font-semibold rounded-full truncate max-w-full">
                      {business.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{business.location}</span>
                </div>

                <p className="text-sm text-gray-600 mb-6 line-clamp-2 flex-grow">{business.description}</p>

                <Link
                  href={`/discover/${business.id}`}
                  className="block w-full py-3 text-center bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-[#1e3a8a] hover:text-white transition-all mt-auto"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}

        {data?.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {data.totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={currentPage === data.totalPages}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}