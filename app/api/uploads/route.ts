import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from the request (you might need to implement proper authentication)
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get uploaded images for the user
    const query = `
      SELECT id, filename, url, uploaded_at, size, original_size 
      FROM user_uploads 
      WHERE user_id = ? 
      ORDER BY uploaded_at DESC 
      LIMIT 20
    `;
    
    const uploads = await executeQuery(query, [userId]);
    
    return NextResponse.json({
      success: true,
      uploads: uploads
    });

  } catch (error) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch uploads' },
      { status: 500 }
    );
  }
} 