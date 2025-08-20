import Image from 'next/image';
import { WhiskeyBottle } from '@/types/whiskey';
import { formatCurrency } from '@/utils/whiskey-stats';
import { getBottleImage } from '@/utils/bottleImages';
import { useAuth } from '@/contexts/AuthContext';

interface WhiskeyCardProps {
  bottle: WhiskeyBottle;
}

export default function WhiskeyCard({ bottle }: WhiskeyCardProps) {
  const { isAuthorized } = useAuth();
  
  // Use replacement cost if available, otherwise fall back to current value per bottle
  const displayValue = bottle.replacementCost ?? (bottle.currentValue / bottle.quantity);
  const gainLoss = displayValue - (bottle.purchasePrice * bottle.quantity);
  const gainLossPercentage = bottle.purchasePrice > 0 
    ? ((gainLoss / (bottle.purchasePrice * bottle.quantity)) * 100)
    : 0;

  const isGain = gainLoss > 0;
  const isLoss = gainLoss < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      {/* Bottle Image */}
      <div className="mb-4 flex justify-center">
        <div className="relative w-24 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <Image
            src={getBottleImage(bottle.name)}
            alt={`${bottle.name} bottle`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 96px, 96px"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/bottles/placeholder-bottle.jpg';
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {bottle.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {bottle.distillery} • {bottle.region}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
            {bottle.quantity} bottle{bottle.quantity > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Country/Type</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {bottle.country} {bottle.type}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Age/ABV</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {bottle.age || 'NAS'} • {bottle.abv ? `${bottle.abv}%` : 'Unknown ABV'}
          </p>
        </div>
      </div>

      {/* Replacement Cost - Always visible */}
      <div className="mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Replacement Cost</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(displayValue)}
          </p>
        </div>
      </div>

      {/* Financial Details - Only show when authorized */}
      {isAuthorized && (
        <>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Purchase Price</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(bottle.purchasePrice)}
              </p>
            </div>
          </div>

          {displayValue > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Gain/Loss
                </span>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    isGain ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {isGain ? '+' : ''}{formatCurrency(gainLoss)}
                  </p>
                  <p className={`text-xs ${
                    isGain ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {gainLossPercentage > 0 ? '+' : ''}{gainLossPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {bottle.batch && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Batch: <span className="text-gray-700 dark:text-gray-300">{bottle.batch}</span>
          </p>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Size: {bottle.size}</span>
          <span>Status: {bottle.status}</span>
        </div>
      </div>
    </div>
  );
}
