'use client';

import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Edit2, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Loader2,
  LayoutDashboard
} from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useGetBusinessById, useTrackEngagement } from '@/services/businessHooks';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export default function ProfileOverview() {
  const params = useParams();
  const id = params.id as string;

  const { data: business, isLoading, isError } = useGetBusinessById(id);
  const engagement = useTrackEngagement();

  useEffect(() => {
    if (id) {
      engagement.mutate({ id, type: 'view' });
    }
  }, [id]);

  const handleContactClick = () => {
    engagement.mutate({ id, type: 'contact' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">Business profile not found.</p>
        <Link href="/dashboard/owner" className="text-[#1e3a8a] hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs 
        items={[
          { label: 'My Businesses', path: '/dashboard/owner' },
          { label: business.name, path: `/dashboard/${id}` },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Overview</h1>
          <p className="text-gray-600">View and manage your business profile</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/owner" 
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4 text-[#1e3a8a]" />
            All Businesses
          </Link>
          <Link
            href={`/dashboard/${id}/edit`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1e3a8a] text-white rounded-xl text-sm font-semibold hover:bg-[#162d6b] transition-all shadow-sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] p-8 text-white">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                  {business.logoUrl ? (
                    <img src={business.logoUrl} alt="logo" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <Store className="w-12 h-12 text-[#1e3a8a]" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{business.name}</h2>
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    {business.category}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-gray-900 font-medium">{business.location}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg"><Phone className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <a 
                      href={`tel:${business.phone}`} 
                      onClick={handleContactClick}
                      className="text-[#1e3a8a] font-semibold hover:underline"
                    >
                      {business.phone || 'Not provided'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg"><Mail className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{business.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg"><Globe className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Website</p>
                    <a 
                      href={business.website?.startsWith('http') ? business.website : `https://${business.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#1e3a8a] font-semibold hover:underline"
                    >
                      {business.website || 'Not provided'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Business Description</p>
                <p className="text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100 italic">
                  "{business.description}"
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Services Offered</h3>
              <Link 
                href={`/dashboard/${id}/services`}
                className="text-[#1e3a8a] hover:underline text-sm font-bold"
              >
                Manage Services
              </Link>
            </div>
            
            {business.services && business.services.length > 0 ? (
              <div className="grid gap-4">
                {business.services.map((service: any) => (
                  <div key={service.id} className="group p-5 border border-gray-100 rounded-2xl hover:border-[#1e3a8a]/30 hover:bg-blue-50/30 transition-all">
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">{service.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm mb-4">No services listed yet.</p>
                <Link 
                  href={`/dashboard/${id}/services`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  Add Your First Service
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{business.viewCount || 0}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-tight">Profile Views</p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-5 bg-green-50/50 rounded-2xl border border-green-100/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{business.contactCount || 0}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-tight">Total Contacts</p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          

          
        </div>
      </div>
    </div>
  );
}