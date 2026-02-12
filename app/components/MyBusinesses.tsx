'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import BusinessCard from './businessCard';
import { toast } from 'sonner';
import AddBusinessModal from './AddBusinessModal';

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
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    
    setBusinesses([
       { id: '1', name: "Joe's Coffee Shop", category: "Food & Beverage", location: "NY", status: "Active" },
       { id: '2', name: "TechFix Solutions", category: "Technology", location: "SF", status: "Active" },
    ]);
    setLoading(false);
  }, []);

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit business:', id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this business?`)) {
      setBusinesses(businesses.filter(b => b.id !== id));
      toast.success('Business deleted successfully');
    }
  };

  const handleBusinessCreated = (newBusiness: Business) => {
    
    setBusinesses((prev) => [
        ...prev, 
        { ...newBusiness, status: 'Active' } 
    ]);
  };

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
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-[#1e3a8a] text-white px-5 py-3 rounded-lg hover:bg-[#1e3a8a]/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Business</span>
            </button>
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
        onSuccess={handleBusinessCreated}
      />
    </div>
  );
}