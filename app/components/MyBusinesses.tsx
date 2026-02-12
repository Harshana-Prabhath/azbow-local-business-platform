import { useState } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import Link from 'next/link';
import BusinessCard from './businessCard';
import { toast } from 'sonner';

interface Business {
  id: number;
  name: string;
  category: string;
  status: 'Active' | 'Draft';
  logo?: string;
}

export default function MyBusinesses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: 1,
      name: "Joe's Coffee Shop",
      category: "Food & Beverage",
      status: "Active",
    },
    {
      id: 2,
      name: "TechFix Solutions",
      category: "Technology",
      status: "Active",
    },
    {
      id: 3,
      name: "Bella's Boutique",
      category: "Retail",
      status: "Draft",
    },
  ]);

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: number) => {
    console.log('Edit business:', id);
    // Navigation will be handled by the card click
  };

  const handleDelete = (id: number) => {
    const business = businesses.find(b => b.id === id);
    if (business && window.confirm(`Are you sure you want to delete "${business.name}"?`)) {
      setBusinesses(businesses.filter(b => b.id !== id));
      toast.success('Business deleted successfully');
    }
  };

  const activeCount = businesses.filter(b => b.status === 'Active').length;
  const draftCount = businesses.filter(b => b.status === 'Draft').length;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Businesses</h1>
          <p className="text-gray-600">Manage all your business profiles in one place</p>
        </div>
        <Link
          href="/dashboard/businesses/new"
          className="flex items-center space-x-2 bg-[#1e3a8a] text-white px-5 py-3 rounded-lg hover:bg-[#1e3a8a]/90 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Business</span>
        </Link>
      </div>

      

      {/* Search Bar */}
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

      {/* Business Cards Grid */}
      {filteredBusinesses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No businesses found' : 'No businesses yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search query' 
              : 'Start by adding your first business profile'}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/businesses/new"
              className="inline-flex items-center space-x-2 bg-[#1e3a8a] text-white px-5 py-3 rounded-lg hover:bg-[#1e3a8a]/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Business</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              name={business.name}
              category={business.category}
              status={business.status}
              logo={business.logo}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
