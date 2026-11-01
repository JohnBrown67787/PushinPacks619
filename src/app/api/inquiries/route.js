import { NextResponse } from 'next/server';
import {
  getAllInquiries,
  createInquiry,
  clearAllInquiries,
  seedSampleInquiries,
} from '@/lib/db';

export async function GET(request) {
  try {
    const inquiries = getAllInquiries();
    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve inquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Support administrative action: initialize sample inquiries
    if (body.action === 'initialize') {
      const seeded = seedSampleInquiries();
      return NextResponse.json({
        success: true,
        message: 'Demonstration inquiries initialized successfully',
        inquiries: seeded,
      }, { status: 201 });
    }

    // Support administrative action: clear all inquiries
    if (body.action === 'clear') {
      const cleared = clearAllInquiries();
      return NextResponse.json({
        success: true,
        message: 'All inquiries cleared successfully',
        inquiries: cleared,
      });
    }

    // Direct inquiry creation
    if (!body.client && !body.name) {
      return NextResponse.json(
        { success: false, error: 'Client name is required' },
        { status: 400 }
      );
    }

    const created = createInquiry(body);
    return NextResponse.json({
      success: true,
      message: 'Inquiry created successfully',
      inquiry: created,
    }, { status: 201 });
  } catch (error) {
    console.error('Inquiry creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while processing inquiry' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cleared = clearAllInquiries();
    return NextResponse.json({
      success: true,
      message: 'All inquiries cleared successfully',
      count: 0,
      inquiries: cleared,
    });
  } catch (error) {
    console.error('Error clearing inquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear inquiries' },
      { status: 500 }
    );
  }
}
