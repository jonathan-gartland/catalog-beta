/**
 * Script to sync whiskey data from Google Sheets and update whiskey-data.ts
 * Run with: npx tsx scripts/sync-from-sheets.ts
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { WhiskeyBottle } from '../src/types/whiskey';

interface SheetRow {
  name: string;
  quantity: string;
  country: string;
  type: string;
  region: string;
  distillery: string;
  age: string;
  purchaseDate: string;
  abv: string;
  size: string;
  purchasePrice: string;
  status: string;
  batch: string;
  notes: string;
  currentValue: string;
  replacementCost?: string;
}

async function fetchFromGoogleSheets(): Promise<WhiskeyBottle[]> {
  // Use the same spreadsheet ID as the Python script
  const sheetsId = process.env.GOOGLE_SHEETS_ID || '1plsSjVwRABsIbpjZGsxBXWpLV4hAGPRTFFlJOV4guFk';
  const sheetId = '0'; // gid from the Python script

  // Try CSV download first (simpler, no auth needed if public)
  try {
    console.log('Attempting to download CSV from Google Sheets...');
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetsId}/export?format=csv&gid=${sheetId}`;
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.log('CSV download failed, trying Google Sheets API...');
    // Fallback to API if CSV download fails
    return fetchFromGoogleSheetsAPI(sheetsId);
  }
}

function parseCSV(csvText: string): WhiskeyBottle[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    return [];
  }

  // Parse header to find column indices
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const getIndex = (possibleNames: string[]): number => {
    for (const name of possibleNames) {
      const idx = header.findIndex(h => h.includes(name));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  const nameIdx = getIndex(['name']);
  const countIdx = getIndex(['count']);
  const countryIdx = getIndex(['country', 'country of origin']);
  const typeIdx = getIndex(['category', 'style', 'type']);
  const regionIdx = getIndex(['region']);
  const distilleryIdx = getIndex(['distillery']);
  const ageIdx = getIndex(['age']);
  const dateIdx = getIndex(['purchased', 'purchase date']);
  const abvIdx = getIndex(['abv']);
  const sizeIdx = getIndex(['volume', 'size']);
  const priceIdx = getIndex(['price', 'cost', 'purchase price']);
  const statusIdx = getIndex(['opened', 'closed', 'status']);
  const batchIdx = getIndex(['errata', 'batch', 'notes']);
  const valueIdx = getIndex(['current value', 'value']);
  const replacementIdx = getIndex(['replacement cost', 'replacement']);

  const bottles: WhiskeyBottle[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim());
    
    const name = nameIdx >= 0 ? row[nameIdx] || '' : '';
    if (!name) continue; // Skip empty rows

    const parseNumber = (idx: number, defaultVal: number = 0): number => {
      if (idx < 0) return defaultVal;
      const val = row[idx]?.replace(/[$,]/g, '') || '';
      const parsed = parseFloat(val);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    const parseInteger = (idx: number, defaultVal: number = 1): number => {
      if (idx < 0) return defaultVal;
      const val = row[idx] || '';
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    bottles.push({
      name,
      quantity: parseInteger(countIdx, 1),
      country: countryIdx >= 0 ? (row[countryIdx] || '') : '',
      type: typeIdx >= 0 ? (row[typeIdx] || '') : '',
      region: regionIdx >= 0 ? (row[regionIdx] || '') : '',
      distillery: distilleryIdx >= 0 ? (row[distilleryIdx] || '') : '',
      age: ageIdx >= 0 ? (row[ageIdx] || '') : '',
      purchaseDate: dateIdx >= 0 ? (row[dateIdx] || '') : '',
      abv: parseNumber(abvIdx, 0),
      size: sizeIdx >= 0 ? (row[sizeIdx] || '750ml') : '750ml',
      purchasePrice: parseNumber(priceIdx, 0),
      status: statusIdx >= 0 ? (row[statusIdx]?.toLowerCase() || 'unopened') : 'unopened',
      batch: batchIdx >= 0 ? (row[batchIdx] || '') : '',
      notes: '', // Notes field not in CSV
      currentValue: parseNumber(valueIdx, 0),
      replacementCost: replacementIdx >= 0 ? parseNumber(replacementIdx) : undefined,
    });
  }

  return bottles;
}

async function fetchFromGoogleSheetsAPI(sheetsId: string): Promise<WhiskeyBottle[]> {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  let auth;
  if (keyFile) {
    auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } else if (clientEmail && privateKey) {
    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } else {
    throw new Error('CSV download failed and no Google Sheets API credentials provided');
  }

  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'Sheet1!A2:P';

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetsId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  // Map rows using same logic as CSV parser
  const bottles: WhiskeyBottle[] = [];
  
  for (const row of rows) {
    const paddedRow = [...row, ...Array(16 - row.length).fill('')];
    const name = paddedRow[0]?.toString().trim() || '';
    if (!name) continue;

    const replacementCostStr = paddedRow[15]?.toString().trim();
    const replacementCost = replacementCostStr
      ? parseFloat(replacementCostStr.replace(/[$,]/g, ''))
      : undefined;

    bottles.push({
      name,
      quantity: parseInt(paddedRow[1]?.toString() || '1', 10) || 1,
      country: paddedRow[2]?.toString().trim() || '',
      type: paddedRow[3]?.toString().trim() || '',
      region: paddedRow[4]?.toString().trim() || '',
      distillery: paddedRow[5]?.toString().trim() || '',
      age: paddedRow[6]?.toString().trim() || '',
      purchaseDate: paddedRow[7]?.toString().trim() || '',
      abv: parseFloat(paddedRow[8]?.toString() || '0') || 0,
      size: paddedRow[9]?.toString().trim() || '750ml',
      purchasePrice: parseFloat(paddedRow[10]?.toString().replace(/[$,]/g, '') || '0') || 0,
      status: paddedRow[11]?.toString().trim().toLowerCase() || 'unopened',
      batch: paddedRow[12]?.toString().trim() || '',
      notes: paddedRow[13]?.toString().trim() || '',
      currentValue: parseFloat(paddedRow[14]?.toString().replace(/[$,]/g, '') || '0') || 0,
      replacementCost: isNaN(replacementCost || NaN) ? undefined : replacementCost,
    });
  }

  return bottles;
}

function generateDataFile(bottles: WhiskeyBottle[]): string {
  const imports = `import { WhiskeyBottle } from '@/types/whiskey';

export const whiskeyCollection: WhiskeyBottle[] = [`;

  const bottleStrings = bottles.map((bottle) => {
    const fields = [
      `    name: ${JSON.stringify(bottle.name)}`,
      `    quantity: ${bottle.quantity}`,
      `    country: ${JSON.stringify(bottle.country)}`,
      `    type: ${JSON.stringify(bottle.type)}`,
      `    region: ${JSON.stringify(bottle.region)}`,
      `    distillery: ${JSON.stringify(bottle.distillery)}`,
      `    age: ${JSON.stringify(bottle.age)}`,
      `    purchaseDate: ${JSON.stringify(bottle.purchaseDate)}`,
      `    abv: ${bottle.abv}`,
      `    size: ${JSON.stringify(bottle.size)}`,
      `    purchasePrice: ${bottle.purchasePrice}`,
      `    status: ${JSON.stringify(bottle.status)}`,
      `    batch: ${JSON.stringify(bottle.batch)}`,
      `    notes: ${JSON.stringify(bottle.notes)}`,
      `    currentValue: ${bottle.currentValue}`,
    ];

    if (bottle.replacementCost !== undefined) {
      fields.push(`    replacementCost: ${bottle.replacementCost}`);
    }

    return `  {\n${fields.join(',\n')}\n  }`;
  });

  return `${imports}\n${bottleStrings.join(',\n')}\n];\n`;
}

async function syncData() {
  try {
    console.log('Fetching data from Google Sheets...');
    const bottles = await fetchFromGoogleSheets();
    console.log(`Fetched ${bottles.length} bottles from Google Sheets`);

    console.log('Generating data file...');
    const dataFileContent = generateDataFile(bottles);

    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'whiskey-data.ts');
    fs.writeFileSync(dataFilePath, dataFileContent, 'utf-8');

    console.log(`✅ Successfully updated ${dataFilePath}`);
    console.log(`   Total bottles: ${bottles.length}`);
  } catch (error) {
    console.error('❌ Error syncing data:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  syncData();
}

export { syncData, fetchFromGoogleSheets };

