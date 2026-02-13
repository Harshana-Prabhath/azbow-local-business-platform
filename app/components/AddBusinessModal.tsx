'use client';
import { useState } from 'react';
import { X, Loader2, Building2, MapPin, Globe, Phone, Mail, FileText, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from '../api/uploadthing/core';
import { useCreateBusiness } from '@/services/businessHooks';

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBusinessModal({ isOpen, onClose }: AddBusinessModalProps) {
  const createBusiness = useCreateBusiness();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    logoUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createBusiness.mutate(formData, {
      onSuccess: () => {
        onClose();
        setFormData({
          name: '', category: '', location: '', phone: '', email: '', website: '', description: '', logoUrl: ''
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Business</h2>
            <p className="text-sm text-gray-500">Enter your business details below</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" /> Business Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Joe's Coffee"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" /> Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 bg-white"
              >
                <option value="">Select Category</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Retail">Retail</option>
                <option value="Technology">Technology</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Location
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 123 Main St, New York, NY"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Business Email
              </label>
              <input
                type="email"
                placeholder="contact@business.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" /> Website URL
              </label>
              <input
                type="url"
                placeholder="https://www.example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2 md:col-span-2 p-4 border-2 border-dashed border-gray-100 rounded-xl">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-400" /> Business Logo (Optional)
              </label>
              
              <div className="flex items-center gap-4">
                {formData.logoUrl ? (
                  <div className="relative w-20 h-20">
                    <img 
                      src={formData.logoUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg border" 
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <UploadButton<OurFileRouter, "imageUploader">
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setFormData({ ...formData, logoUrl: res[0].url });
                        toast.success("Logo uploaded!");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                )}
              </div>
              <p className="text-xs text-gray-400">If skipped, a default banner will be used.</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Description
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell us about your business..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={createBusiness.isPending}
              className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createBusiness.isPending}
              className="px-5 py-2.5 rounded-lg bg-[#1e3a8a] text-white font-medium hover:bg-[#1e3a8a]/90 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createBusiness.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Business'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}