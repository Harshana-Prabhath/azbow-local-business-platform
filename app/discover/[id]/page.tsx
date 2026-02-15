'use client';

import { useState, use, useEffect } from 'react';
import { ArrowLeft, Heart, MapPin, Phone, Mail, Globe, Share2, ChevronRight, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGetBusinessDetails, useToggleBookmark, useTrackEngagement } from '@/services/userHooks';
import { toast } from 'sonner';
import TopNavigation from '@/app/components/TopNavigation';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function BusinessDetailedView({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { data: business, isLoading } = useGetBusinessDetails(unwrappedParams.id);
  const toggleBookmark = useToggleBookmark();
  const engagement = useTrackEngagement();
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (unwrappedParams.id) {
      engagement.mutate({ businessId: unwrappedParams.id, type: 'view' });
    }
  }, [unwrappedParams.id]);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" /></div>;
  if (!business) return <div className="text-center py-20 text-red-500">Business not found</div>;

  const handleWhatsAppContact = () => {
    const phoneNumber = business.phone?.replace(/\D/g, '');
    if (!phoneNumber) return toast.error('Phone number not available');
    
    engagement.mutate({ businessId: business.id, type: 'contact' });

    const message = encodeURIComponent(`Hi! I found your business on Team Azbow and would like to learn more.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <TopNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm mb-6">
          <Link href="/discover" className="flex items-center text-gray-600 hover:text-[#1e3a8a]">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/discover" className="text-gray-600 hover:text-[#1e3a8a]">{business.category}</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{business.name}</span>
        </div>

        <Link href="/discover" className="inline-flex items-center space-x-2 text-[#1e3a8a] hover:text-[#1e3a8a]/80 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> <span>Back to Search</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start space-x-6 flex-1">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-2xl flex items-center justify-center flex-shrink-0">
                {business.logoUrl ? (
                  <img src={business.logoUrl} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span className="text-white font-bold text-4xl">{business.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1e3a8a] text-sm font-semibold rounded-full">{business.category}</span>
                </div>
                <p className="text-lg text-gray-600 italic">Connecting Sri Lankan communities.</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 lg:min-w-[280px]">
              <button onClick={handleWhatsAppContact} className="flex items-center justify-center space-x-3 px-6 py-4 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20BD5A] shadow-md">
                <WhatsAppIcon /> <span>Contact on WhatsApp</span>
              </button>
              <button onClick={() => toggleBookmark.mutate(business.id)} className="flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold bg-white text-[#1e3a8a] border-2 border-[#1e3a8a] hover:bg-blue-50">
                <Heart className={`w-5 h-5 ${business.isBookmarked ? 'fill-current' : ''}`} /> <span>{business.isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Business</h2>
              <p className="text-gray-700 leading-relaxed">{business.description}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
              <div className="space-y-4">
                {business.services?.map((service: any, index: number) => (
                  <div key={service.id} className={`pb-4 ${index !== business.services.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
                {!business.services?.length && <p className="text-gray-500">No specific services listed.</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#1e3a8a]" />
                  <div><p className="text-sm font-medium text-gray-500">Location</p><p className="text-gray-900">{business.location}</p></div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#1e3a8a]" />
                  <div><p className="text-sm font-medium text-gray-500">Phone Number</p><a href={`tel:${business.phone}`} className="text-gray-900 hover:text-[#1e3a8a]">{business.phone}</a></div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#1e3a8a]" />
                  <div><p className="text-sm font-medium text-gray-500">Email</p><a href={`mailto:${business.email}`} className="text-gray-900 hover:text-[#1e3a8a] break-all">{business.email}</a></div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-[#1e3a8a]" />
                  <div><p className="text-sm font-medium text-gray-500">Website</p><a href={business.website} target="_blank" className="text-[#1e3a8a] hover:underline break-all">{business.website}</a></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share this profile</h3>
              <button onClick={handleCopyLink} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                <Share2 className="w-5 h-5" /> <span>{linkCopied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}