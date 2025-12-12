'use client';

import { WhiskeyBottle } from '@/types/whiskey';
import { groupByExpression, ExpressionGroup } from '@/utils/expression-utils';
import ExpressionCard from './ExpressionCard';
import Button from './ui/Button';
import { useMemo } from 'react';

interface BrandDetailViewProps {
  brand: string;
  bottles: WhiskeyBottle[];
  onBack: () => void;
  onExpressionClick: (expressionName: string) => void;
}

export default function BrandDetailView({ brand, bottles, onBack, onExpressionClick }: BrandDetailViewProps) {
  // Group all bottles by expression
  const expressionGroups = useMemo(() => {
    return groupByExpression(bottles);
  }, [bottles]);

  // Handle expression click
  const handleExpressionClick = (expression: ExpressionGroup) => {
    onExpressionClick(expression.expressionName);
  };

  const totalBottles = bottles.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 flex items-center space-x-2"
            aria-label="Back to brands"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Brands</span>
          </Button>
          
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {brand}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {expressionGroups.length} {expressionGroups.length === 1 ? 'expression' : 'expressions'} • {totalBottles} {totalBottles === 1 ? 'bottle' : 'bottles'}
            </p>
          </div>
        </div>

        {/* Inventory List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Inventory
          </h2>
          
          <div
            className="space-y-3"
            role="list"
            aria-label={`${brand} inventory`}
          >
            {expressionGroups.map((expression) => (
              <div key={expression.expressionName} role="listitem">
                <ExpressionCard
                  expression={expression}
                  onClick={() => handleExpressionClick(expression)}
                />
              </div>
            ))}
          </div>

          {expressionGroups.length === 0 && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No expressions available for this brand.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

