import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    
    // Obtener todas las áreas únicas de total_mercado
    const areas = await executeQuery(`
      SELECT DISTINCT TRIM(area) as nombre, TRIM(area) as id
      FROM total_mercado 
      WHERE area IS NOT NULL AND TRIM(area) != ''
      ORDER BY TRIM(area) ASC
    `, []) as Array<{id: string, nombre: string}>;

    return NextResponse.json({
      success: true,
      areas: areas
    });
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { success: false, error: 'La creación de áreas no está disponible. Las áreas se obtienen de los datos existentes.' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Error creating area:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
