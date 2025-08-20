'use client';

import { useState } from 'react';

interface FilterControlsProps {
  onFilterChange: (filters: FilterState) => void;
  countries: string[];
  types: string[];
  distilleries: string[];
}

export interface FilterState {
  search: string;
  country: string;
  type: string;
  distillery: string;
  sortBy: 'name' | 'purchasePrice' | 'currentValue' | 'purchaseDate' | 'abv';
  sortOrder: 'asc' | 'desc';
}

export default function FilterControls({ onFilterChange, countries, types, distilleries }: FilterControlsProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    country: '',
    type: '',
    distillery: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters & Search</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, distillery, batch..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.country}
            onChange={(e) => updateFilters({ country: e.target.value })}
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value })}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Distillery Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Distillery
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.distillery}
            onChange={(e) => updateFilters({ distillery: e.target.value })}
          >
            <option value="">All Distilleries</option>
            {distilleries.map(distillery => (
              <option key={distillery} value={distillery}>{distillery}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
          >
            <option value="name">Name</option>
            <option value="purchasePrice">Purchase Price</option>
            <option value="currentValue">Current Value</option>
            <option value="purchaseDate">Purchase Date</option>
            <option value="abv">ABV</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="sortOrder"
            value="asc"
            checked={filters.sortOrder === 'asc'}
            onChange={(e) => updateFilters({ sortOrder: e.target.value as 'asc' | 'desc' })}
            className="text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Ascending</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="sortOrder"
            value="desc"
            checked={filters.sortOrder === 'desc'}
            onChange={(e) => updateFilters({ sortOrder: e.target.value as 'asc' | 'desc' })}
            className="text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Descending</span>
        </label>
      </div>
    </div>
  );
}
