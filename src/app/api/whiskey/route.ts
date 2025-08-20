import { NextRequest, NextResponse } from 'next/server';
import { fetchWhiskeyDataFromSheets, addWhiskeyToSheet } from '@/lib/googleSheets';
import { WhiskeyBottle } from '@/types/whiskey';

// GET: Fetch all whiskey data from Google Sheets
export async function GET() {
  try {
    const whiskeyData = await fetchWhiskeyDataFromSheets();
    return NextResponse.json({ data: whiskeyData, success: true });
  } catch (error) {
    console.error('API Error fetching whiskey data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whiskey data', success: false },
      { status: 500 }
    );
  }
}

// POST: Add new whiskey to Google Sheets
export async function POST(request: NextRequest) {
  try {
    const whiskeyData: WhiskeyBottle = await request.json();
    
    // Validate required fields
    if (!whiskeyData.name || !whiskeyData.distillery) {
      return NextResponse.json(
        { error: 'Name and distillery are required', success: false },
        { status: 400 }
      );
    }

    await addWhiskeyToSheet(whiskeyData);
    return NextResponse.json({ success: true, message: 'Whiskey added successfully' });
  } catch (error) {
    console.error('API Error adding whiskey:', error);
    return NextResponse.json(
      { error: 'Failed to add whiskey', success: false },
      { status: 500 }
    );
  }
}
