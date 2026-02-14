'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { 
  Save, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useGetBusinessById, useUpdateBusiness } from '@/services/businessHooks';
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from '@/app/api/uploadthing/core';
import Breadcrumbs from '@/app/components/Breadcrumbs';

const businessSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must not exceed 500 characters'),
  logoUrl: z.string().optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

const categories = [
  'Retail', 'Food & Beverage', 'Technology', 'Healthcare', 'Education',
  'Professional Services', 'Home Services', 'Beauty & Wellness', 'Entertainment', 'Other'
];

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: business, isLoading } = useGetBusinessById(id);
  const updateMutation = useUpdateBusiness(id);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  });

  const currentLogo = watch('logoUrl');

  useEffect(() => {
    if (business) {
      reset({
        businessName: business.name,
        category: business.category,
        location: business.location,
        phone: business.phone || '',
        email: business.email || '',
        website: business.website || '',
        description: business.description,
        logoUrl: business.logoUrl || '',
      });
    }
  }, [business, reset]);

  const onSubmit = (data: BusinessFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        router.push(`/dashboard/${id}`);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  const inputStyles = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400 bg-white";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: 'My Businesses', path: '/dashboard/owner' },
          { label: business?.name || 'Business', path: `/dashboard/${id}` },
          { label: 'Edit Profile', path: `/dashboard/${id}/edit` },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Profile Management</h1>
        <p className="text-gray-600">Update your business information and public presence</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="w-5 h-5 text-[#1e3a8a]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('businessName')}
                  className={inputStyles}
                  placeholder="e.g. Joe's Coffee Shop"
                />
                {errors.businessName && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-4 h-4" /> {errors.businessName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select {...register('category')} className={inputStyles}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      {...register('location')}
                      className={`${inputStyles} pl-11`}
                      placeholder="Street, City"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" {...register('phone')} className={`${inputStyles} pl-11`} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" {...register('email')} className={`${inputStyles} pl-11`} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    {...register('website')}
                    className={`${inputStyles} pl-11`}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-[#1e3a8a]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">About the Business</h2>
            </div>
            <textarea
              {...register('description')}
              rows={6}
              className={`${inputStyles} resize-none leading-relaxed`}
              placeholder="Tell customers what makes your business unique..."
            />
            <div className="mt-3 flex justify-between">
              <p className="text-xs text-gray-400 font-medium italic">Min 20 characters required</p>
              <p className="text-xs text-gray-400 font-medium">Max 500 characters</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#1e3a8a]" /> Business Logo
            </h2>
            
            <div className="mb-6">
              {currentLogo ? (
                <div className="group relative rounded-2xl overflow-hidden border-2 border-gray-100 aspect-square">
                  <img
                    src={currentLogo}
                    alt="Business Logo"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setValue('logoUrl', '')}
                      className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <UploadButton<OurFileRouter, "imageUploader">
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) setValue('logoUrl', res[0].url);
                    }}
                    appearance={{
                      button: "bg-[#1e3a8a] px-6 py-2 rounded-lg text-sm font-bold",
                      allowedContent: "hidden"
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-4 leading-relaxed px-4">Square image recommended (Max 5MB)</p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full flex items-center justify-center gap-3 bg-[#1e3a8a] text-white py-4 rounded-xl font-bold hover:bg-[#162d6b] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save All Changes
              </button>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#1e3a8a] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#1e3a8a] mb-1 uppercase tracking-wider">Auto-Sync</p>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    Updating your profile will immediately reflect across the platform to help you attract more customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}