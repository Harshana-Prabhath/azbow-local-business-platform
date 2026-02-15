import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface Business {
  id: string;
  name: string;
  category: string;
  location: string;
  phone?: string;
  email?: string;
  website?: string;
  description: string;
  logoUrl?: string;
  viewCount: number;
  contactCount: number;
  services: Service[];
}

export interface Service {
  id: string;
  title: string;
  description?: string;
}

interface BusinessesResponse {
  businesses: Business[];
  totalPages: number;
  currentPage: number;
}

export const useGetBusinessById = (id: string) => {
  return useQuery<Business, Error>({
    queryKey: ['business', id],
    queryFn: async () => {
      const response = await fetch(`/api/businesses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch business details');
      return response.json();
    },
    enabled: !!id,
  });
};

export const useTrackEngagement = () => {
  const queryClient = useQueryClient();

  return useMutation<Business, Error, { id: string; type: 'view' | 'contact' }>({
    mutationFn: async ({ id, type }) => {
      const response = await fetch(`/api/businesses/${id}/engage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (!response.ok) throw new Error('Failed to track engagement');
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
};


export const useGetBusinesses = (page: number = 1) => {
  return useQuery<BusinessesResponse, Error>({
    queryKey: ['businesses', page],
    queryFn: async () => {
      const response = await fetch(`/api/businesses?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch businesses');
      return response.json();
    },
    placeholderData: keepPreviousData,
  });
};


export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation<Business, Error, Partial<Business>>({
    mutationFn: async (newBusiness) => {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusiness),
      });
      if (!response.ok) throw new Error('Failed to create business');
      return response.json();
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong');
    },
  });
};

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/businesses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete business');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Business deletion failed');
    },
  });
};

export const useUpdateBusiness = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await fetch(`/api/businesses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update business');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', id] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Something went wrong');
    },
  });
};

export const useGetServices = (businessId: string) => {
  return useQuery({
    queryKey: ['services', businessId],
    queryFn: async () => {
      const res = await fetch(`/api/businesses/${businessId}/services`);
      if (!res.ok) throw new Error('Failed to fetch services');
      return res.json();
    },
    enabled: !!businessId,
  });
};

export const useAddService = (businessId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const res = await fetch(`/api/businesses/${businessId}/services`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', businessId] });
      toast.success('Service added successfully');
    },
  });
};

export const useUpdateService = (businessId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { serviceId: string; title: string; description: string }) => {
      const res = await fetch(`/api/businesses/${businessId}/services`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', businessId] });
      toast.success('Service updated successfully');
    },
  });
};

export const useDeleteService = (businessId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (serviceId: string) => {
      await fetch(`/api/businesses/${businessId}/services?serviceId=${serviceId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', businessId] });
      toast.success('Service deleted successfully');
    },
  });
};




