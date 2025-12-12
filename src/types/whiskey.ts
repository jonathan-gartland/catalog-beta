import { WhiskeyCountry, WhiskeyType, BottleStatus, BottleSize } from '@/constants/whiskey';

export interface WhiskeyBottle {
  name: string;
  quantity: number;
  country: string; // WhiskeyCountry enum value
  type: string; // WhiskeyType enum value
  region: string;
  distillery: string;
  age: string;
  purchaseDate: string;
  abv: number;
  size: string; // BottleSize enum value
  purchasePrice: number;
  status: string; // BottleStatus enum value
  batch: string;
  notes: string;
  currentValue: number;
  replacementCost?: number;
}

export interface WhiskeyStats {
  totalBottles: number;
  totalValue: number;
  totalReplacementCost: number;
  totalInvestment: number;
  totalGainLoss: number;
  averageAge: number;
  countryBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  distilleryBreakdown: Record<string, number>;
}
