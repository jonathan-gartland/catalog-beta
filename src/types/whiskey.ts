export interface WhiskeyBottle {
  name: string;
  quantity: number;
  country: string;
  type: string;
  region: string;
  distillery: string;
  age: string;
  purchaseDate: string;
  abv: number;
  size: string;
  purchasePrice: number;
  status: string;
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
