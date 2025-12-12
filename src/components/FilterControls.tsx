'use client';

import { useMemo } from 'react';
import { FilterState } from '@/hooks/useCollectionFilters';
import { SortField, SortOrder, SORT_FIELD_LABELS } from '@/constants/whiskey';
import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  countries: string[];
  types: string[];
  distilleries: string[];
}

export default function FilterControls({
  filters,
  onFilterChange,
  countries,
  types,
  distilleries,
}: FilterControlsProps) {
  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c, label: c })),
    [countries]
  );

  const typeOptions = useMemo(
    () => types.map((t) => ({ value: t, label: t })),
    [types]
  );

  const distilleryOptions = useMemo(
    () => distilleries.map((d) => ({ value: d, label: d })),
    [distilleries]
  );

  const sortOptions = useMemo(
    () =>
      Object.values(SortField).map((field) => ({
        value: field,
        label: SORT_FIELD_LABELS[field],
      })),
    []
  );

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filters & Search
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <Input
            type="text"
            placeholder="Search by name, distillery, batch..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            aria-label="Search collection"
          />
        </div>

        {/* Country Filter */}
        <Select
          label="Country"
          value={filters.country}
          onChange={(e) => onFilterChange({ country: e.target.value })}
          options={countryOptions}
          placeholder="All Countries"
        />

        {/* Type Filter */}
        <Select
          label="Type"
          value={filters.type}
          onChange={(e) => onFilterChange({ type: e.target.value })}
          options={typeOptions}
          placeholder="All Types"
        />

        {/* Distillery Filter */}
        <Select
          label="Distillery"
          value={filters.distillery}
          onChange={(e) => onFilterChange({ distillery: e.target.value })}
          options={distilleryOptions}
          placeholder="All Distilleries"
        />

        {/* Sort By */}
        <Select
          label="Sort By"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as SortField })}
          options={sortOptions}
        />
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="sortOrder"
            value={SortOrder.ASC}
            checked={filters.sortOrder === SortOrder.ASC}
            onChange={(e) => onFilterChange({ sortOrder: e.target.value as SortOrder })}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Ascending</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="sortOrder"
            value={SortOrder.DESC}
            checked={filters.sortOrder === SortOrder.DESC}
            onChange={(e) => onFilterChange({ sortOrder: e.target.value as SortOrder })}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Descending</span>
        </label>
      </div>
    </Card>
  );
}
