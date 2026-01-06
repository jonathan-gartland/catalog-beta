import { ExpressionGroup } from '@/utils/expression-utils';
import { getBottleImage } from '@/utils/bottleImages';
import Card from './ui/Card';
import Image from 'next/image';

interface ExpressionCardProps {
  expression: ExpressionGroup;
  onClick: () => void;
}

export default function ExpressionCard({ expression, onClick }: ExpressionCardProps) {
  const bottle = expression.representativeBottle;
  const imagePath = getBottleImage(expression.expressionName);
  
  // Get the primary size (most common or first)
  const primarySize = expression.sizes[0] || bottle.size;
  
  return (
    <Card
      hover
      className="p-4 cursor-pointer transition-all hover:scale-[1.02] border-l-4 border-l-blue-500"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${expression.expressionName} details`}
    >
      <div className="flex items-start gap-4">
        {/* Bottle Image */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-28 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <Image
              src={imagePath}
              alt={`${expression.expressionName} bottle`}
              fill
              className="object-contain"
              sizes="80px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/bottles/placeholder-bottle.jpg';
              }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {expression.expressionName}
          </h3>
          
          {/* Distillery and Region */}
          <div className="mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {bottle.distillery} {bottle.region && `• ${bottle.region}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {bottle.country} {bottle.type}
            </p>
          </div>

          {/* Age and ABV */}
          {(bottle.age && bottle.age !== '-') || bottle.abv ? (
            <div className="mb-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              {bottle.age && bottle.age !== '-' && (
                <span>{bottle.age}</span>
              )}
              {bottle.age && bottle.age !== '-' && bottle.abv > 0 && (
                <span>•</span>
              )}
              {bottle.abv > 0 && (
                <span>{bottle.abv}% ABV</span>
              )}
            </div>
          ) : null}

          {/* Size and Quantity */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {expression.sizes.length === 1 ? (
              <>
                <span>{primarySize}</span>
                <span>•</span>
                <span>{expression.totalQuantity} {expression.totalQuantity === 1 ? 'bottle' : 'bottles'}</span>
              </>
            ) : (
              <div className="space-y-1">
                {expression.sizes.map((size) => {
                  // Calculate quantity for this size
                  const sizeQuantity = expression.bottles
                    .filter(b => b.size === size)
                    .reduce((sum, b) => sum + b.quantity, 0);
                  return (
                    <span key={size} className="block text-xs">
                      {size} • {sizeQuantity} {sizeQuantity === 1 ? 'bottle' : 'bottles'}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Batch info if available */}
          {bottle.batch && bottle.batch !== '' && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Batch: {bottle.batch}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 self-center">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500"
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
    </Card>
  );
}

