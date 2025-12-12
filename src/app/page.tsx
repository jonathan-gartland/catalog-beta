'use client';

import { useState, useMemo } from 'react';
import { whiskeyCollection } from '@/data/whiskey-data';
import { calculateWhiskeyStats, formatCurrency } from '@/utils/whiskey-stats';
import { WhiskeyBottle } from '@/types/whiskey';
import { groupByBrand, getBottlesByBrand } from '@/utils/brand-utils';
import StatsCard from '@/components/StatsCard';
import BrandCard from '@/components/BrandCard';
import BrandDetailView from '@/components/BrandDetailView';
import BottleDetailView from '@/components/BottleDetailView';
import AddWhiskeyForm from '@/components/AddWhiskeyForm';
import AuthToggle from '@/components/AuthToggle';
import { useAuth } from '@/contexts/AuthContext';
import { groupByExpression } from '@/utils/expression-utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

type ViewMode = 'brands' | 'brand-detail' | 'bottle-detail';

export default function Home() {
  const { isAuthorized } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('brands');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null);

  // Use the local whiskey data directly
  const currentData = whiskeyCollection;
  
  // Group by brand
  const brandGroups = useMemo(() => groupByBrand(currentData), [currentData]);
  
  // Get selected brand bottles if in detail view
  const selectedBrandBottles = useMemo(() => {
    if (selectedBrand) {
      return getBottlesByBrand(currentData, selectedBrand);
    }
    return [];
  }, [currentData, selectedBrand]);

  // Get selected expression group if in bottle detail view
  const selectedExpressionGroup = useMemo(() => {
    if (selectedBrand && selectedExpression) {
      const brandBottles = getBottlesByBrand(currentData, selectedBrand);
      const expressions = groupByExpression(brandBottles);
      return expressions.find(e => e.expressionName === selectedExpression) || null;
    }
    return null;
  }, [currentData, selectedBrand, selectedExpression]);

  // Calculate stats
  const stats = useMemo(() => calculateWhiskeyStats(currentData), [currentData]);

  const gainLossPercentage =
    stats.totalInvestment > 0 ? (stats.totalGainLoss / stats.totalInvestment) * 100 : 0;

  const handleAddWhiskey = async (whiskey: WhiskeyBottle) => {
    // For now, just log the whiskey data (could implement local storage later)
    console.log('Adding whiskey to local data:', whiskey);
    return true;
  };

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    setViewMode('brand-detail');
  };

  const handleExpressionClick = (brand: string, expressionName: string) => {
    setSelectedBrand(brand);
    setSelectedExpression(expressionName);
    setViewMode('bottle-detail');
  };

  const handleBackToBrands = () => {
    setViewMode('brands');
    setSelectedBrand(null);
    setSelectedExpression(null);
  };

  const handleBackToBrandDetail = () => {
    setViewMode('brand-detail');
    setSelectedExpression(null);
  };

  // Show bottle detail view
  if (viewMode === 'bottle-detail' && selectedExpressionGroup && selectedBrand) {
    return (
      <>
        <BottleDetailView
          expression={selectedExpressionGroup}
          brand={selectedBrand}
          onBack={handleBackToBrandDetail}
        />
        {showAddForm && (
          <AddWhiskeyForm
            onAdd={handleAddWhiskey}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </>
    );
  }

  // Show brand detail view
  if (viewMode === 'brand-detail' && selectedBrand) {
    return (
      <>
        <BrandDetailView
          brand={selectedBrand}
          bottles={selectedBrandBottles}
          onBack={handleBackToBrands}
          onExpressionClick={(expressionName) => handleExpressionClick(selectedBrand, expressionName)}
        />
        {showAddForm && (
          <AddWhiskeyForm
            onAdd={handleAddWhiskey}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </>
    );
  }

  // Show brands view (default)
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
            <Button
              onClick={() => setShowAddForm(true)}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Whiskey</span>
            </Button>
          </div>
          
          {/* Auth Toggle */}
          <div className="flex justify-end">
            <AuthToggle />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Brands"
            value={brandGroups.length}
            icon={<span className="text-2xl">🏷️</span>}
          />
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
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">By Country</h3>
            <div className="space-y-2">
              {Object.entries(stats.countryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([country, count]) => (
                  <div key={country} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{country}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">By Type</h3>
            <div className="space-y-2">
              {Object.entries(stats.typeBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{type}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Distilleries</h3>
            <div className="space-y-2">
              {Object.entries(stats.distilleryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([distillery, count]) => (
                  <div key={distillery} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{distillery}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Brands Grid */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Brands
          </h2>
          <p className="text-gray-600 dark:text-gray-400" aria-live="polite">
            {brandGroups.length} {brandGroups.length === 1 ? 'brand' : 'brands'} in your collection
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="list"
          aria-label="Whiskey brands"
        >
          {brandGroups.map((brand) => (
            <div key={brand.brand} role="listitem">
              <BrandCard
                brand={brand}
                onClick={() => handleBrandClick(brand.brand)}
                onExpressionClick={(expressionName) => handleExpressionClick(brand.brand, expressionName)}
              />
            </div>
          ))}
        </div>

        {brandGroups.length === 0 && (
          <div className="text-center py-12" role="status" aria-live="polite">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No brands available. Add your first whiskey to get started!
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
