import { Edit2, Trash2 } from 'lucide-react';

interface ServiceItemProps {
  id: number;
  name: string;
  details: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isEditing?: boolean;
}

export default function ServiceItem({ 
  id, 
  name, 
  details, 
  onEdit, 
  onDelete,
  isEditing = false
}: ServiceItemProps) {
  return (
    <div className={`border rounded-lg p-4 transition-all ${
      isEditing 
        ? 'border-[#1e3a8a] bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(id)}
            className="p-2 text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit service"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete service"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{details}</p>
    </div>
  );
}
