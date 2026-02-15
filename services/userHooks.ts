import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SearchParams {
  query: string;
  category: string;
  location: string;
  page: number;
}

export const useSearchBusinesses = (params: SearchParams) => {
  return useQuery({
    queryKey: ['user-businesses', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        query: params.query,
        category: params.category,
        location: params.location,
        page: params.page.toString(),
      });
      const res = await fetch(`/api/user/businesses?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch businesses');
      return res.json();
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetBusinessDetails = (id: string) => {
  return useQuery({
    queryKey: ['business-details', id],
    queryFn: async () => {
      const res = await fetch(`/api/user/businesses/${id}`);
      if (!res.ok) throw new Error('Failed to load business');
      return res.json();
    },
    enabled: !!id,
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (businessId: string) => {
      const res = await fetch('/api/user/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ businessId }),
      });
      if (!res.ok) throw new Error('Failed to update bookmark');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
      toast.success('Bookmarks updated');
    },
  });
};

export const useGetUserBookmarks = () => {
  return useQuery({
    queryKey: ['user-bookmarks'],
    queryFn: async () => {
      const res = await fetch('/api/user/bookmarks');
      if (!res.ok) throw new Error('Failed to load bookmarks');
      return res.json();
    },
  });
};

export const useTrackEngagement = () => {
  return useMutation({
    mutationFn: async (data: { businessId: string; type: 'view' | 'contact' }) => {
      await fetch('/api/engagement', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });
};