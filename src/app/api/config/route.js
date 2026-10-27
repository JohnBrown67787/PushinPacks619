import { NextResponse } from 'next/server';
import { getStoreConfig, updateStoreConfig } from '@/lib/db';

export async function GET() {
  try {
    const config = getStoreConfig();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching store config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve store configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = updateStoreConfig(body);
    return NextResponse.json({
      success: true,
      message: 'Store configuration updated successfully',
      config: updated
    });
  } catch (error) {
    console.error('Error updating store config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update store configuration' },
      { status: 500 }
    );
  }
}
