/**
 * Script to sync whiskey data from PostgreSQL database and update whiskey-data.ts
 * Run with: npx tsx scripts/sync-from-db.ts
 * 
 * Requires database connection from liquor_app project
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { WhiskeyBottle } from '../src/types/whiskey';

interface DatabaseRow {
  name: string;
  count: number;
  country_of_origin: string | null;
  category_style: string | null;
  region: string | null;
  distillery: string | null;
  age: string | null;
  purchased_approx: string | null;
  abv: number | null;
  volume: string | null;
  price_cost: number | null;
  opened_closed: string | null;
  errata: string | null;
  replacement_cost: number | null;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  // Convert YYYY-MM-DD to M/D/YYYY format
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function convertToWhiskeyBottle(row: DatabaseRow): WhiskeyBottle {
  return {
    name: row.name,
    quantity: row.count || 1,
    country: row.country_of_origin || '',
    type: row.category_style || '',
    region: row.region || '',
    distillery: row.distillery || '',
    age: row.age || '',
    purchaseDate: formatDate(row.purchased_approx),
    abv: row.abv || 0,
    size: row.volume || '750ml',
    purchasePrice: row.price_cost || 0,
    status: row.opened_closed?.toLowerCase() || 'unopened',
    batch: row.errata || '',
    notes: '',
    currentValue: row.replacement_cost || row.price_cost || 0,
    replacementCost: row.replacement_cost || undefined,
  };
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

async function syncFromDatabase() {
  // Database config - matches liquor_app defaults
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'liquor_db',
    user: process.env.DB_USER || 'jonny',
    password: process.env.DB_PASSWORD || '',
  };

  console.log('Connecting to database...');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  Database: ${dbConfig.database}`);

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✓ Connected to database');

    console.log('Fetching liquor data...');
    const result = await client.query<DatabaseRow>(
      `SELECT 
        name, count, country_of_origin, category_style, region, distillery,
        age, purchased_approx, abv, volume, price_cost, opened_closed,
        errata, replacement_cost
      FROM liquor
      ORDER BY name, distillery`
    );

    console.log(`✓ Fetched ${result.rows.length} records from database`);

    // Convert to WhiskeyBottle format
    const bottles = result.rows.map(convertToWhiskeyBottle);

    console.log('Generating data file...');
    const dataFileContent = generateDataFile(bottles);

    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'whiskey-data.ts');
    fs.writeFileSync(dataFilePath, dataFileContent, 'utf-8');

    console.log(`✅ Successfully updated ${dataFilePath}`);
    console.log(`   Total bottles: ${bottles.length}`);
  } catch (error) {
    console.error('❌ Error syncing from database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if executed directly
if (require.main === module) {
  syncFromDatabase();
}

export { syncFromDatabase };

