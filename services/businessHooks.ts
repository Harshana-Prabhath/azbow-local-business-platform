import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  category: string;
  location: string;
  logoUrl?: string;
  description: string;
  status?: string;
  createdAt: string;
}


export const useGetBusinesses = () => {
  return useQuery<Business[], Error>({
    queryKey: ['businesses'],
    queryFn: async () => {
      const response = await fetch('/api/businesses');
      if (!response.ok) throw new Error('Failed to fetch businesses');
      return response.json();
    },
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