/**
 * Constants and enums for whiskey collection management
 */

export enum WhiskeyCountry {
  US = 'US',
  SCOTLAND = 'Scotland',
  IRELAND = 'Ireland',
  JAPAN = 'Japan',
  CANADA = 'Canada',
  OTHER = 'Other',
}

export enum WhiskeyType {
  BOURBON = 'Bourbon',
  SCOTCH = 'Scotch',
  RYE = 'Rye',
  IRISH = 'Irish',
  JAPANESE = 'Japanese',
  CORN = 'Corn',
  OTHER = 'Other',
}

export enum BottleStatus {
  UNOPENED = 'unopened',
  OPENED = 'opened',
  FINISHED = 'finished',
}

export enum BottleSize {
  ML_375 = '375ml',
  ML_700 = '700ml',
  ML_750 = '750ml',
  L_1 = '1L',
  L_175 = '1.75L',
}

export enum SortField {
  NAME = 'name',
  PURCHASE_PRICE = 'purchasePrice',
  CURRENT_VALUE = 'currentValue',
  PURCHASE_DATE = 'purchaseDate',
  ABV = 'abv',
  REPLACEMENT_COST = 'replacementCost',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const WHISKEY_COUNTRIES = Object.values(WhiskeyCountry);
export const WHISKEY_TYPES = Object.values(WhiskeyType);
export const BOTTLE_STATUSES = Object.values(BottleStatus);
export const BOTTLE_SIZES = Object.values(BottleSize);
export const SORT_FIELDS = Object.values(SortField);

export const SORT_FIELD_LABELS: Record<SortField, string> = {
  [SortField.NAME]: 'Name',
  [SortField.PURCHASE_PRICE]: 'Purchase Price',
  [SortField.CURRENT_VALUE]: 'Current Value',
  [SortField.PURCHASE_DATE]: 'Purchase Date',
  [SortField.ABV]: 'ABV',
  [SortField.REPLACEMENT_COST]: 'Replacement Cost',
};

