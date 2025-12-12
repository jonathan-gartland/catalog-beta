import { WhiskeyBottle } from '@/types/whiskey';

export interface BrandGroup {
  brand: string;
  bottles: WhiskeyBottle[];
  totalBottles: number;
  totalValue: number;
  totalInvestment: number;
  expressions: string[]; // Unique expression names
}

/**
 * Known single-word brands that should always be treated as just the first word
 */
const SINGLE_WORD_BRANDS = [
  'Ardbeg',
  'Laphroaig',
  'Weller',
  'Macallan',
  'Glenfiddich',
  'Glenlivet',
  'Lagavulin',
  'Bowmore',
  'Talisker',
  'Highland',
  'Lowland',
  'Speyside',
];

/**
 * Extract brand name from whiskey name
 * Examples:
 * - "Elijah Craig Barrel Proof" -> "Elijah Craig"
 * - "Blanton's Gold" -> "Blanton's"
 * - "Laphroaig 10 Cask Strength" -> "Laphroaig"
 * - "Ardbeg Traigh Bhan" -> "Ardbeg"
 * - "Weller Special Reserve" -> "Weller"
 */
export function extractBrandName(whiskeyName: string): string {
  const parts = whiskeyName.split(/\s+/);
  
  // Handle apostrophes (e.g., "Blanton's")
  if (parts[0].includes("'")) {
    return parts[0];
  }
  
  // Check if first word is a known single-word brand
  const firstWord = parts[0];
  if (SINGLE_WORD_BRANDS.includes(firstWord)) {
    return firstWord;
  }
  
  // Check if second part is a number (age statement) - brand is first word only
  const numberPattern = /^\d+/;
  if (parts.length >= 2 && numberPattern.test(parts[1])) {
    return parts[0];
  }
  
  // Check if second part is a year (4 digits) - brand is first word only
  const yearPattern = /^\d{4}$/;
  if (parts.length >= 2 && yearPattern.test(parts[1])) {
    return parts[0];
  }
  
  // Check if second part looks like an age statement (e.g., "12yr", "10yo", "18y")
  const agePattern = /^\d+[yY][ro]?$/;
  if (parts.length >= 2 && agePattern.test(parts[1])) {
    return parts[0];
  }
  
  // For two-word brands like "Elijah Craig", "Old Fitzgerald"
  // Check if second word is a common descriptor that's part of the expression
  const expressionDescriptors = [
    'Barrel', 'Single', 'Double', 'Triple', 'Cask', 'Small', 'Limited',
    'Special', 'Reserve', 'Traigh', 'Bhan', 'Wee', 'Beastie', 'Cardeas',
    'Sherry', 'Oak', 'Proof', 'Strength'
  ];
  
  if (parts.length >= 2) {
    const secondPart = parts[1];
    
    // If second part is an expression descriptor, brand is first word only
    if (expressionDescriptors.some(desc => secondPart.includes(desc))) {
      return parts[0];
    }
    
    // If second part is a proper name (capitalized and not a descriptor), it's likely part of brand
    // This handles "Elijah Craig", "Old Fitzgerald", etc.
    if (secondPart[0] === secondPart[0].toUpperCase() && 
        !expressionDescriptors.some(desc => secondPart.includes(desc))) {
      // Check if third part is a number or descriptor - if so, brand is first two words
      if (parts.length >= 3) {
        const thirdPart = parts[2];
        if (numberPattern.test(thirdPart) || 
            yearPattern.test(thirdPart) || 
            agePattern.test(thirdPart) ||
            expressionDescriptors.some(desc => thirdPart.includes(desc))) {
          return parts.slice(0, 2).join(' ');
        }
      }
      // Otherwise, assume it's a two-word brand
      return parts.slice(0, 2).join(' ');
    }
  }
  
  // Default: return first word only (safer default)
  return parts[0];
}

/**
 * Group whiskeys by brand
 */
export function groupByBrand(bottles: WhiskeyBottle[]): BrandGroup[] {
  const brandMap = new Map<string, WhiskeyBottle[]>();
  
  bottles.forEach(bottle => {
    const brand = extractBrandName(bottle.name);
    if (!brandMap.has(brand)) {
      brandMap.set(brand, []);
    }
    brandMap.get(brand)!.push(bottle);
  });
  
  // Convert to BrandGroup array
  const brandGroups: BrandGroup[] = Array.from(brandMap.entries()).map(([brand, brandBottles]) => {
    const totalBottles = brandBottles.reduce((sum, b) => sum + b.quantity, 0);
    const totalValue = brandBottles.reduce((sum, b) => sum + b.currentValue, 0);
    const totalInvestment = brandBottles.reduce((sum, b) => sum + (b.purchasePrice * b.quantity), 0);
    const expressions = [...new Set(brandBottles.map(b => b.name))].sort();
    
    return {
      brand,
      bottles: brandBottles,
      totalBottles,
      totalValue,
      totalInvestment,
      expressions,
    };
  });
  
  // Sort alphabetically by brand name
  return brandGroups.sort((a, b) => a.brand.localeCompare(b.brand));
}

/**
 * Get bottles for a specific brand
 */
export function getBottlesByBrand(bottles: WhiskeyBottle[], brand: string): WhiskeyBottle[] {
  return bottles.filter(bottle => extractBrandName(bottle.name) === brand);
}

