import { useMemo, useState, useCallback } from 'react';
import { WhiskeyBottle } from '@/types/whiskey';
import { SortField, SortOrder } from '@/constants/whiskey';

export interface FilterState {
  search: string;
  country: string;
  type: string;
  distillery: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const defaultFilters: FilterState = {
  search: '',
  country: '',
  type: '',
  distillery: '',
  sortBy: SortField.NAME,
  sortOrder: SortOrder.ASC,
};

export function useCollectionFilters(collection: WhiskeyBottle[]) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const filteredAndSorted = useMemo(() => {
    const filtered = collection.filter((bottle) => {
      const matchesSearch =
        !filters.search ||
        bottle.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        bottle.distillery.toLowerCase().includes(filters.search.toLowerCase()) ||
        bottle.batch.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCountry = !filters.country || bottle.country === filters.country;
      const matchesType = !filters.type || bottle.type === filters.type;
      const matchesDistillery = !filters.distillery || bottle.distillery === filters.distillery;

      return matchesSearch && matchesCountry && matchesType && matchesDistillery;
    });

    // Sort bottles
    filtered.sort((a, b) => {
      let aValue: string | number | Date = a[filters.sortBy] as string | number;
      let bValue: string | number | Date = b[filters.sortBy] as string | number;

      // Handle special cases
      if (filters.sortBy === SortField.PURCHASE_DATE) {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return filters.sortOrder === SortOrder.ASC ? comparison : -comparison;
    });

    return filtered;
  }, [collection, filters]);

  const uniqueValues = useMemo(() => {
    const countries = [...new Set(collection.map((b) => b.country))].sort();
    const types = [...new Set(collection.map((b) => b.type))].sort();
    const distilleries = [
      ...new Set(collection.map((b) => b.distillery).filter((d) => d && d !== '-')),
    ].sort();

    return { countries, types, distilleries };
  }, [collection]);

  return {
    filters,
    updateFilters,
    resetFilters,
    filteredAndSorted,
    uniqueValues,
  };
}

