'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, Save, X, Loader2, Wrench } from 'lucide-react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { 
  useGetServices, 
  useAddService, 
  useUpdateService, 
  useDeleteService,
  useGetBusinessById 
} from '@/services/businessHooks';

const serviceSchema = z.object({
  title: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().min(10, 'Details must be at least 10 characters').max(200),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServiceManagement() {
  const params = useParams();
  const businessId = params.id as string;
  
  const { data: business } = useGetBusinessById(businessId);
  const { data: services, isLoading, isError } = useGetServices(businessId);
  const addMutation = useAddService(businessId);
  const updateMutation = useUpdateService(businessId);
  const deleteMutation = useDeleteService(businessId);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  const { 
    register: registerEdit, 
    handleSubmit: handleSubmitEdit, 
    reset: resetEdit, 
    setValue 
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  if (isLoading) return <div className="flex py-20"><Loader2 className="animate-spin mx-auto w-10 h-10 text-[#1e3a8a]" /></div>;
  if (isError) return <div className="text-center py-20 text-red-500">Something went wrong. Please try again later.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Breadcrumbs 
        items={[
          { label: 'My Businesses', path: '/dashboard/owner' },
          { label: business?.name || 'Business', path: `/dashboard/${businessId}` },
          { label: 'Services', path: `/dashboard/${businessId}/services` },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
          <p className="text-gray-600">Manage what your business offers to Sri Lankan customers</p>
        </div>
        {!isAdding && services && services.length > 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#1e3a8a] text-white px-5 py-3 rounded-lg hover:bg-[#1e3a8a]/90 transition-all shadow-sm"
          >
            <Plus size={20} /> Add New Service
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isAdding && (
            <div className="bg-white rounded-xl shadow-md border-2 border-[#1e3a8a] p-6 animate-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">New Service</h2>
                <button onClick={() => { setIsAdding(false); reset(); }}><X size={20} className="text-gray-400" /></button>
              </div>
              <form onSubmit={handleSubmit((data) => addMutation.mutate(data, { onSuccess: () => { setIsAdding(false); reset(); } }))} className="space-y-4">
                <input {...register('title')} placeholder="Service Title" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                <textarea {...register('description')} placeholder="Details" className="w-full p-3 border rounded-lg text-gray-900 resize-none focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsAdding(false); reset(); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={addMutation.isPending} className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50">
                    {addMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Add
                  </button>
                </div>
              </form>
            </div>
          )}

          {!services || services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-[#1e3a8a]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
              <p className="text-gray-600 mb-6 max-w-xs mx-auto">Start by adding your first service to showcase your offerings to customers.</p>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center space-x-2 bg-[#1e3a8a] text-white px-8 py-3 rounded-lg hover:bg-[#1e3a8a]/90 transition-all shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Add Your First Service</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {services?.map((service: any) => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                  {editingId === service.id ? (
                    <form onSubmit={handleSubmitEdit((data) => updateMutation.mutate({ serviceId: service.id, ...data }, { onSuccess: () => setEditingId(null) }))} className="space-y-4">
                      <input {...registerEdit('title')} className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                      <textarea {...registerEdit('description')} className="w-full p-3 border rounded-lg text-gray-900 resize-none focus:ring-2 focus:ring-[#1e3a8a] outline-none" />
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={updateMutation.isPending} className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg flex items-center gap-2">
                          {updateMutation.isPending && <Loader2 className="animate-spin" size={18} />} Update
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                        <p className="text-gray-600 mt-2">{service.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(service.id); setValue('title', service.title); setValue('description', service.description); }} className="p-2 text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => { if(confirm('Delete this service?')) deleteMutation.mutate(service.id) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8 border-gray-100">
            <h3 className="text-lg font-bold mb-4">Service Insights</h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 font-medium">Total Services Listed</p>
              <p className="text-4xl font-bold text-[#1e3a8a] mt-1">{services?.length || 0}</p>
            </div>
            <div className="mt-6 space-y-4">
               <div className="flex gap-3 items-start text-xs text-gray-500">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                 <p>Clear titles and descriptions help improve search visibility.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}