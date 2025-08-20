import { WhiskeyBottle, WhiskeyStats } from '@/types/whiskey';

export function calculateWhiskeyStats(collection: WhiskeyBottle[]): WhiskeyStats {
  const totalBottles = collection.reduce((sum, bottle) => sum + bottle.quantity, 0);
  const totalValue = collection.reduce((sum, bottle) => sum + bottle.currentValue, 0);
  const totalReplacementCost = collection.reduce((sum, bottle) => sum + ((bottle.replacementCost ?? bottle.currentValue) * bottle.quantity), 0);
  const totalInvestment = collection.reduce((sum, bottle) => sum + (bottle.purchasePrice * bottle.quantity), 0);
  const totalGainLoss = totalValue - totalInvestment;

  // Calculate average age (excluding bottles with no age data)
  const bottlesWithAge = collection.filter(bottle => bottle.age && bottle.age !== '-' && bottle.age !== '');
  const averageAge = bottlesWithAge.length > 0 
    ? bottlesWithAge.reduce((sum, bottle) => {
        const ageMatch = bottle.age.match(/(\d+)/);
        return sum + (ageMatch ? parseInt(ageMatch[1]) : 0);
      }, 0) / bottlesWithAge.length
    : 0;

  // Country breakdown
  const countryBreakdown: Record<string, number> = {};
  collection.forEach(bottle => {
    countryBreakdown[bottle.country] = (countryBreakdown[bottle.country] || 0) + bottle.quantity;
  });

  // Type breakdown
  const typeBreakdown: Record<string, number> = {};
  collection.forEach(bottle => {
    typeBreakdown[bottle.type] = (typeBreakdown[bottle.type] || 0) + bottle.quantity;
  });

  // Distillery breakdown
  const distilleryBreakdown: Record<string, number> = {};
  collection.forEach(bottle => {
    if (bottle.distillery && bottle.distillery !== '-') {
      distilleryBreakdown[bottle.distillery] = (distilleryBreakdown[bottle.distillery] || 0) + bottle.quantity;
    }
  });

  return {
    totalBottles,
    totalValue,
    totalReplacementCost,
    totalInvestment,
    totalGainLoss,
    averageAge,
    countryBreakdown,
    typeBreakdown,
    distilleryBreakdown
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
