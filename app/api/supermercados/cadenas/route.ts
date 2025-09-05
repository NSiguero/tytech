import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    
    // Obtener todas las cadenas de supermercados únicas de total_mercado y total_carrefour
    const cadenas = await executeQuery(`
      SELECT DISTINCT TRIM(cadena) as nombre, TRIM(cadena) as id 
      FROM (
        SELECT cadena FROM total_mercado WHERE cadena IS NOT NULL AND TRIM(cadena) != ''
        UNION
        SELECT cadena FROM total_carrefour WHERE cadena IS NOT NULL AND TRIM(cadena) != ''
      ) AS combined_cadenas
      ORDER BY TRIM(cadena) ASC
    `, []) as Array<{id: string, nombre: string}>;

    return NextResponse.json({
      success: true,
      cadenas: cadenas
    });
  } catch (error) {
    console.error('Error fetching cadenas:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { success: false, error: 'La creación de cadenas no está disponible. Las cadenas se obtienen de los datos existentes.' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Error creating cadena:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
