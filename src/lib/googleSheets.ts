import { google } from 'googleapis';
import { WhiskeyBottle } from '@/types/whiskey';

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const RANGE = 'Sheet1!A:P'; // Adjust range based on your sheet structure

// Initialize Google Sheets API
const sheets = google.sheets('v4');

// Helper function to parse whiskey data from spreadsheet row
function parseWhiskeyRow(row: string[]): WhiskeyBottle | null {
  if (!row || row.length < 15) return null;

  // Parse ABV and purchase price, handling potential string format
  const parsePrice = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace(/[$,]/g, ''));
  };

  const parseABV = (value: string) => {
    if (!value) return 0;
    return parseFloat(value);
  };

  return {
    name: row[0] || '',
    quantity: parseInt(row[1]) || 1,
    country: row[2] || '',
    type: row[3] || '',
    region: row[4] || '',
    distillery: row[5] || '',
    age: row[6] || '',
    purchaseDate: row[7] || '',
    abv: parseABV(row[8]),
    size: row[9] || '',
    purchasePrice: parsePrice(row[10]),
    status: row[11] || '',
    batch: row[12] || '',
    notes: row[13] || '',
    currentValue: parsePrice(row[14])
  };
}

// Fetch data from Google Sheets
export async function fetchWhiskeyDataFromSheets(): Promise<WhiskeyBottle[]> {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Google Sheets ID not configured');
    }

    // Set up authentication
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    // Fetch data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and parse data
    const whiskeyData: WhiskeyBottle[] = [];
    for (let i = 1; i < rows.length; i++) {
      const whiskey = parseWhiskeyRow(rows[i]);
      if (whiskey && whiskey.name) {
        whiskeyData.push(whiskey);
      }
    }

    return whiskeyData;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

// Update a specific cell in Google Sheets
export async function updateSheetCell(
  row: number,
  column: string,
  value: string
): Promise<void> {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Google Sheets ID not configured');
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${column}${row}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[value]],
      },
    });
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
}

// Add a new row to Google Sheets
export async function addWhiskeyToSheet(whiskey: WhiskeyBottle): Promise<void> {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Google Sheets ID not configured');
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    const values = [
      [
        whiskey.name,
        whiskey.quantity.toString(),
        whiskey.country,
        whiskey.type,
        whiskey.region,
        whiskey.distillery,
        whiskey.age,
        whiskey.purchaseDate,
        whiskey.abv.toString(),
        whiskey.size,
        `$${whiskey.purchasePrice.toFixed(2)}`,
        whiskey.status,
        whiskey.batch,
        whiskey.notes,
        `$${whiskey.currentValue.toFixed(2)}`
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:O',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error('Error adding whiskey to sheet:', error);
    throw error;
  }
}
