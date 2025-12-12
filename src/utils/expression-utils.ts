import { WhiskeyBottle } from '@/types/whiskey';

export interface ExpressionGroup {
  expressionName: string;
  bottles: WhiskeyBottle[];
  totalQuantity: number;
  sizes: string[]; // Unique sizes
  representativeBottle: WhiskeyBottle; // First bottle as representative
}

/**
 * Group bottles by expression name (same name = same expression)
 */
export function groupByExpression(bottles: WhiskeyBottle[]): ExpressionGroup[] {
  const expressionMap = new Map<string, WhiskeyBottle[]>();
  
  bottles.forEach(bottle => {
    const expressionName = bottle.name;
    if (!expressionMap.has(expressionName)) {
      expressionMap.set(expressionName, []);
    }
    expressionMap.get(expressionName)!.push(bottle);
  });
  
  // Convert to ExpressionGroup array
  const expressionGroups: ExpressionGroup[] = Array.from(expressionMap.entries()).map(([expressionName, expressionBottles]) => {
    const totalQuantity = expressionBottles.reduce((sum, b) => sum + b.quantity, 0);
    const sizes = [...new Set(expressionBottles.map(b => b.size))].sort();
    
    return {
      expressionName,
      bottles: expressionBottles,
      totalQuantity,
      sizes,
      representativeBottle: expressionBottles[0], // Use first bottle as representative
    };
  });
  
  // Sort alphabetically by expression name
  return expressionGroups.sort((a, b) => a.expressionName.localeCompare(b.expressionName));
}

