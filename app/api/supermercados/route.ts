import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cadena = searchParams.get('cadena');
    const area = searchParams.get('area');
    
    let query = '';
    let params: any[] = [];
    
    if (cadena && area) {
      // Get supermarkets for specific chain and area
      query = `
        SELECT id, codigo, cadena, razon_social, rotulo, direccion, municipio, provincia, area 
        FROM total_mercado 
        WHERE cadena = ? AND area = ?
        ORDER BY rotulo ASC
      `;
      params = [cadena, area];
    } else if (cadena) {
      // Get supermarkets for specific chain from both tables
      query = `
        SELECT id, codigo, cadena, razon_social, rotulo, direccion, municipio, provincia, area 
        FROM total_mercado 
        WHERE cadena = ?
        UNION ALL
        SELECT id, codigo, cadena, razon_social, rotulo, direccion, municipio, provincia, NULL as area
        FROM total_carrefour 
        WHERE cadena = ?
        ORDER BY rotulo ASC
      `;
      params = [cadena, cadena];
    } else if (area) {
      // Get supermarkets for specific area
      query = `
        SELECT id, codigo, cadena, razon_social, rotulo, direccion, municipio, provincia, area 
        FROM total_mercado 
        WHERE area = ?
        ORDER BY rotulo ASC
      `;
      params = [area];
    } else {
      // Get all supermarkets from both tables
      query = `
        SELECT id, codigo, cadena, razon_social, rotulo, direccion, municipio, provincia, area 
        FROM total_mercado
        UNION ALL
        SELECT id, codigo, cadena, razon_social, rotulo, direccion, municipio, provincia, NULL as area
        FROM total_carrefour
        ORDER BY rotulo ASC
      `;
    }
    
    const supermercados = await executeQuery(query, params) as Array<{
      id: number;
      codigo: string;
      cadena: string;
      razon_social: string;
      rotulo: string;
      direccion: string;
      municipio: string;
      provincia: string;
      area: string | null;
    }>;

    return NextResponse.json({
      success: true,
      supermercados: supermercados
    });
  } catch (error) {
    console.error('Error fetching supermercados:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
