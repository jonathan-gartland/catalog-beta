'use client';

import { ExpressionGroup } from '@/utils/expression-utils';
import { formatCurrency } from '@/utils/whiskey-stats';
import { getBottleImage } from '@/utils/bottleImages';
import { useAuth } from '@/contexts/AuthContext';
import Button from './ui/Button';
import Card from './ui/Card';
import Image from 'next/image';

interface BottleDetailViewProps {
  expression: ExpressionGroup;
  brand: string;
  onBack: () => void;
}

export default function BottleDetailView({ expression, onBack, brand }: BottleDetailViewProps) {
  const { isAuthorized } = useAuth();
  const bottle = expression.representativeBottle;
  const imagePath = getBottleImage(expression.expressionName);

  // Calculate financial stats
  const totalPurchasePrice = expression.bottles.reduce(
    (sum, b) => sum + b.purchasePrice * b.quantity,
    0
  );
  const totalCurrentValue = expression.bottles.reduce(
    (sum, b) => sum + b.currentValue,
    0
  );
  const totalReplacementCost = expression.bottles.reduce(
    (sum, b) => sum + (b.replacementCost ?? b.currentValue) * b.quantity,
    0
  );
  const totalGainLoss = totalCurrentValue - totalPurchasePrice;
  const gainLossPercentage =
    totalPurchasePrice > 0 ? (totalGainLoss / totalPurchasePrice) * 100 : 0;

  const isGain = totalGainLoss > 0;
  const isLoss = totalGainLoss < 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 flex items-center space-x-2"
            aria-label="Back to brand"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to {brand}</span>
          </Button>

          <div className="flex flex-col gap-6 mb-6">
            {/* Bottle Image */}
            <div className="flex-shrink-0 flex justify-center">
              <div className="relative w-48 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <Image
                  src={imagePath}
                  alt={`${expression.expressionName} bottle`}
                  fill
                  className="object-contain"
                  sizes="192px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/bottles/placeholder-bottle.jpg';
                  }}
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {expression.expressionName}
              </h1>

              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {bottle.distillery}
                  </p>
                  {bottle.region && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{bottle.region}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{bottle.country}</span>
                  <span>•</span>
                  <span>{bottle.type}</span>
                </div>

                {(bottle.age && bottle.age !== '-') || bottle.abv > 0 ? (
                  <div className="flex items-center gap-4 text-sm">
                    {bottle.age && bottle.age !== '-' && (
                      <span className="text-gray-900 dark:text-white font-medium">
                        Age: {bottle.age}
                      </span>
                    )}
                    {bottle.abv > 0 && (
                      <span className="text-gray-900 dark:text-white font-medium">
                        ABV: {bottle.abv}%
                      </span>
                    )}
                  </div>
                ) : null}

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {expression.totalQuantity} {expression.totalQuantity === 1 ? 'bottle' : 'bottles'}
                  </p>
                  {expression.sizes.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sizes: {expression.sizes.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Details - Only show when authorized */}
        {isAuthorized && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Financial Details
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Total Investment
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalPurchasePrice)}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Current Value
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalCurrentValue)}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Replacement Cost
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalReplacementCost)}
                </p>
              </Card>

              <Card className="p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Gain/Loss
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isGain
                      ? 'text-green-600 dark:text-green-400'
                      : isLoss
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {isGain ? '+' : ''}
                  {formatCurrency(totalGainLoss)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    isGain
                      ? 'text-green-600 dark:text-green-400'
                      : isLoss
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {gainLossPercentage > 0 ? '+' : ''}
                  {gainLossPercentage.toFixed(1)}%
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Bottle Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bottle Details
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </p>
                <p className="text-base text-gray-900 dark:text-white capitalize">
                  {bottle.status}
                </p>
              </div>

              {bottle.batch && bottle.batch !== '' && (
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Batch
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">{bottle.batch}</p>
                </div>
              )}

              {bottle.purchaseDate && (
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Purchase Date
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">{bottle.purchaseDate}</p>
                </div>
              )}

              {bottle.notes && bottle.notes !== '' && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Notes
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">{bottle.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Individual Bottles Breakdown */}
        {expression.bottles.length > 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Individual Bottles
            </h2>
            <div className="space-y-3">
              {expression.bottles.map((bottle, index) => {
                const bottlePurchasePrice = bottle.purchasePrice * bottle.quantity;
                const bottleGainLoss = bottle.currentValue - bottlePurchasePrice;
                const bottleGainLossPercentage =
                  bottlePurchasePrice > 0 ? (bottleGainLoss / bottlePurchasePrice) * 100 : 0;
                const isBottleGain = bottleGainLoss > 0;
                const isBottleLoss = bottleGainLoss < 0;

                return (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {bottle.size} • {bottle.quantity} {bottle.quantity === 1 ? 'bottle' : 'bottles'}
                        </p>
                        {bottle.batch && bottle.batch !== '' && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Batch: {bottle.batch}
                          </p>
                        )}
                        {bottle.purchaseDate && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Purchased: {bottle.purchaseDate}
                          </p>
                        )}
                      </div>
                      {isAuthorized && (
                        <div className="ml-4 text-right space-y-1 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            Purchase: {formatCurrency(bottlePurchasePrice)}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Value: {formatCurrency(bottle.currentValue)}
                          </p>
                          {bottle.replacementCost && (
                            <p className="text-gray-600 dark:text-gray-400">
                              Replacement: {formatCurrency(bottle.replacementCost * bottle.quantity)}
                            </p>
                          )}
                          <p
                            className={`font-medium ${
                              isBottleGain
                                ? 'text-green-600 dark:text-green-400'
                                : isBottleLoss
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {isBottleGain ? '+' : ''}
                            {formatCurrency(bottleGainLoss)} ({bottleGainLossPercentage > 0 ? '+' : ''}
                            {bottleGainLossPercentage.toFixed(1)}%)
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Single Bottle Pricing Details */}
        {expression.bottles.length === 1 && isAuthorized && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pricing Details
            </h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Purchase Price (per bottle)
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(bottle.purchasePrice)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Total: {formatCurrency(bottle.purchasePrice * bottle.quantity)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Current Value
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(bottle.currentValue)}
                  </p>
                </div>
                {bottle.replacementCost && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Replacement Cost (per bottle)
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(bottle.replacementCost)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Total: {formatCurrency(bottle.replacementCost * bottle.quantity)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

