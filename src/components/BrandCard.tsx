import { BrandGroup } from '@/utils/brand-utils';
import { groupByExpression } from '@/utils/expression-utils';
import Card from './ui/Card';
import { getBottleImage } from '@/utils/bottleImages';
import Image from 'next/image';

interface BrandCardProps {
  brand: BrandGroup;
  onClick: () => void;
  onExpressionClick?: (expressionName: string) => void;
}

export default function BrandCard({ brand, onClick, onExpressionClick }: BrandCardProps) {
  // Get the first bottle's image as a representative image
  const representativeBottle = brand.bottles[0];
  const imagePath = getBottleImage(representativeBottle.name);

  // Group bottles by expression
  const expressions = groupByExpression(brand.bottles);

  const handleExpressionClick = (e: React.MouseEvent, expressionName: string) => {
    e.stopPropagation(); // Prevent card click
    if (onExpressionClick) {
      onExpressionClick(expressionName);
    } else {
      // Default: navigate to brand detail page
      onClick();
    }
  };

  return (
    <Card
      hover
      className="p-6 transition-all hover:scale-105"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${brand.brand} collection`}
    >
      {/* Brand Image */}
      <div className="mb-4 flex justify-center">
        <div className="relative w-32 h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <Image
            src={imagePath}
            alt={`${brand.brand} bottle`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 128px, 128px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/bottles/placeholder-bottle.jpg';
            }}
          />
        </div>
      </div>

      {/* Brand Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        {brand.brand}
      </h3>

      {/* Expressions List */}
      <div className="space-y-2">
        {expressions.map((expression) => {
          // Group bottles by size to show quantity per size
          const bottlesBySize = new Map<string, number>();
          expression.bottles.forEach(bottle => {
            const current = bottlesBySize.get(bottle.size) || 0;
            bottlesBySize.set(bottle.size, current + bottle.quantity);
          });
          
          // If only one size, show simple format
          if (expression.sizes.length === 1) {
            const size = expression.sizes[0];
            const quantity = bottlesBySize.get(size) || 0;
            return (
              <div
                key={expression.expressionName}
                onClick={(e) => handleExpressionClick(e, expression.expressionName)}
                className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExpressionClick(e as any, expression.expressionName);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {expression.expressionName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {size} • {quantity} {quantity === 1 ? 'bottle' : 'bottles'}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            );
          }
          
          // Multiple sizes - show all sizes with quantities
          return (
            <div
              key={expression.expressionName}
              onClick={(e) => handleExpressionClick(e, expression.expressionName)}
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleExpressionClick(e as any, expression.expressionName);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {expression.expressionName}
                  </p>
                  <div className="space-y-0.5">
                    {expression.sizes.map((size) => {
                      const quantity = bottlesBySize.get(size) || 0;
                      return (
                        <p key={size} className="text-xs text-gray-600 dark:text-gray-400">
                          {size} • {quantity} {quantity === 1 ? 'bottle' : 'bottles'}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

