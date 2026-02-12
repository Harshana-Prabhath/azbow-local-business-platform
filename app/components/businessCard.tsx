import { Store, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  status: string;
  logo?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BusinessCard({ 
  id, 
  name, 
  category, 
  status, 
  logo,
  onEdit,
  onDelete 
}: BusinessCardProps) {
  return (
    <Link
      href={`/dashboard/${id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-[#1e3a8a] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {logo ? (
            <img 
              src={logo} 
              alt={name}
              className="w-14 h-14 rounded-lg object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-lg flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#1e3a8a] transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-600">{category}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full mr-2 ${
            status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></span>
          {status}
        </span>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(id);
            }}
            className="p-2 text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
