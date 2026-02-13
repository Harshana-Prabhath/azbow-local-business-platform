'use client';

import { useState } from 'react';
import { Plus, Search, Building2, Loader2 } from 'lucide-react';
import BusinessCard from './businessCard';
import AddBusinessModal from './AddBusinessModal';
import { useDeleteBusiness, useGetBusinesses } from '@/services/businessHooks';

interface Business {
  id: string;
  name: string;
  category: string;
  location: string;
  status?: string; 
  logoUrl?: string;
}

export default function MyBusinesses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: businesses, isLoading, isError } = useGetBusinesses();
  const deleteMutation = useDeleteBusiness();

  const filteredBusinesses = businesses?.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit business:', id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this business?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="flex py-20"><Loader2 className="animate-spin mx-auto w-10 h-10 text-[#1e3a8a]" /></div>;
  if (isError) return <p className="text-center text-red-500 py-20">Failed to load data. Please check your connection.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Businesses</h1>
          <p className="text-gray-600">Manage all your business profiles in one place</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-[#1e3a8a] text-white px-5 py-3 rounded-lg hover:bg-[#1e3a8a]/90 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Business</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search businesses by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 bg-white"
          />
        </div>
      </div>

      {!businesses || businesses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-[#1e3a8a]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses yet</h3>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            You haven't registered any businesses. Create your first business profile to start connecting with the community.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-[#1e3a8a] text-white px-8 py-3 rounded-lg hover:bg-[#1e3a8a]/90 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create New Business</span>
          </button>
        </div>
      ) : filteredBusinesses?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            We couldn't find any business matching "<strong>{searchQuery}</strong>".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses?.map((business) => (
            <BusinessCard
              key={business.id}
              id={business.id} 
              name={business.name}
              category={business.category}
              status={business.status || 'Active'}
              logo={business.logoUrl}
              onEdit={() => handleEdit(business.id)}
              onDelete={() => handleDelete(business.id)}
            />
          ))}
        </div>
      )}

      <AddBusinessModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}