'use client';

import { useState, useMemo } from 'react';
import { whiskeyCollection } from '@/data/whiskey-data';
import { calculateWhiskeyStats, formatCurrency } from '@/utils/whiskey-stats';
import { useWhiskeyData } from '@/hooks/useWhiskeyData';
import { WhiskeyBottle } from '@/types/whiskey';
import StatsCard from '@/components/StatsCard';
import WhiskeyCard from '@/components/WhiskeyCard';
import FilterControls, { FilterState } from '@/components/FilterControls';
import AddWhiskeyForm from '@/components/AddWhiskeyForm';
import AuthToggle from '@/components/AuthToggle';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthorized } = useAuth();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    country: '',
    type: '',
    distillery: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [dataSource] = useState<'local' | 'sheets'>('local');
  const [showAddForm, setShowAddForm] = useState(false);

  // Google Sheets data hook
  const { data: sheetsData, loading, addWhiskey } = useWhiskeyData();

  // Choose data source
  const currentData = dataSource === 'sheets' ? sheetsData : whiskeyCollection;

  // Calculate stats
  const stats = useMemo(() => calculateWhiskeyStats(currentData), [currentData]);

  // Get unique values for filters
  const countries = useMemo(() => [...new Set(currentData.map(b => b.country))].sort(), [currentData]);
  const types = useMemo(() => [...new Set(currentData.map(b => b.type))].sort(), [currentData]);
  const distilleries = useMemo(() => [...new Set(currentData.map(b => b.distillery).filter(d => d && d !== '-'))].sort(), [currentData]);

  // Filter and sort bottles
  const filteredBottles = useMemo(() => {
    const filtered = currentData.filter(bottle => {
      const matchesSearch = !filters.search || 
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
      if (filters.sortBy === 'purchaseDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [filters, currentData]);

  const gainLossPercentage = stats.totalInvestment > 0 
    ? ((stats.totalGainLoss / stats.totalInvestment) * 100)
    : 0;

  const handleAddWhiskey = async (whiskey: WhiskeyBottle) => {
    if (dataSource === 'sheets') {
      return await addWhiskey(whiskey);
    } else {
      // For local data, just close the form (you'd implement local storage or other persistence here)
      console.log('Adding whiskey to local data:', whiskey);
      return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                🥃 Whiskey Collection
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your premium whiskey collection
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Whiskey</span>
            </button>
          </div>
          
          {/* Auth Toggle */}
          <div className="flex justify-end">
            <AuthToggle />
          </div>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Bottles"
            value={stats.totalBottles}
            icon={<span className="text-2xl">🍾</span>}
          />
          {isAuthorized && (
            <>
              <StatsCard
                title="Total Investment"
                value={formatCurrency(stats.totalInvestment)}
                icon={<span className="text-2xl">💰</span>}
              />
              <StatsCard
                title="Gain/Loss"
                value={formatCurrency(stats.totalGainLoss)}
                subtitle={`${gainLossPercentage >= 0 ? '+' : ''}${gainLossPercentage.toFixed(1)}%`}
                trend={stats.totalGainLoss > 0 ? 'positive' : stats.totalGainLoss < 0 ? 'negative' : 'neutral'}
                icon={<span className="text-2xl">📊</span>}
              />
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">By Country</h3>
            <div className="space-y-2">
              {Object.entries(stats.countryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([country, count]) => (
                <div key={country} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{country}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">By Type</h3>
            <div className="space-y-2">
              {Object.entries(stats.typeBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{type}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Distilleries</h3>
            <div className="space-y-2">
              {Object.entries(stats.distilleryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([distillery, count]) => (
                <div key={distillery} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{distillery}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterControls
          onFilterChange={setFilters}
          countries={countries}
          types={types}
          distilleries={distilleries}
        />

        {/* Collection Grid */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your Collection
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredBottles.length} of {currentData.length} bottles
            {dataSource === 'sheets' && loading && ' (loading...)'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBottles.map((bottle, index) => (
            <WhiskeyCard key={`${bottle.name}-${bottle.batch}-${index}`} bottle={bottle} />
          ))}
        </div>

        {filteredBottles.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {currentData.length === 0 
                ? 'No whiskey data available.' 
                : 'No bottles match your current filters.'
              }
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && dataSource === 'sheets' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Loading whiskey data from Google Sheets...
            </p>
          </div>
        )}

        {/* Add Whiskey Form Modal */}
        {showAddForm && (
          <AddWhiskeyForm
            onAdd={handleAddWhiskey}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}

