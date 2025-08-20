'use client';

import { useState, useEffect, useCallback } from 'react';
import { WhiskeyBottle } from '@/types/whiskey';

interface UseWhiskeyDataReturn {
  data: WhiskeyBottle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addWhiskey: (whiskey: WhiskeyBottle) => Promise<boolean>;
}

export function useWhiskeyData(): UseWhiskeyDataReturn {
  const [data, setData] = useState<WhiskeyBottle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/whiskey');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error: Failed to fetch whiskey data');
      console.error('Error fetching whiskey data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addWhiskey = useCallback(async (whiskey: WhiskeyBottle): Promise<boolean> => {
    try {
      const response = await fetch('/api/whiskey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whiskey),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data after successful addition
        await fetchData();
        return true;
      } else {
        setError(result.error || 'Failed to add whiskey');
        return false;
      }
    } catch (err) {
      setError('Network error: Failed to add whiskey');
      console.error('Error adding whiskey:', err);
      return false;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    addWhiskey,
  };
}
