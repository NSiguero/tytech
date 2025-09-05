import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get supermarket data with visit statistics
    const query = `
      SELECT 
        tm.id,
        tm.codigo,
        tm.cadena,
        tm.rotulo,
        tm.direccion,
        tm.municipio,
        tm.provincia,
        tm.area,
        tm.cereales,
        tm.snacks,
        COUNT(t.id) as total_visitas,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as visitas_completadas,
        COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as visitas_pendientes,
        COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as visitas_en_progreso,
        AVG(t.actual_hours) as promedio_horas,
        MAX(t.updated_at) as ultima_visita
      FROM total_mercado tm
      LEFT JOIN tasks t ON tm.id = t.supermercado_id AND t.category = 'visita'
      GROUP BY tm.id, tm.codigo, tm.cadena, tm.rotulo, tm.direccion, tm.municipio, tm.provincia, tm.area, tm.cereales, tm.snacks
      ORDER BY total_visitas DESC, tm.snacks DESC
    `;

    const supermercados = await executeQuery(query);
    
    return NextResponse.json({
      success: true,
      data: supermercados
    });

  } catch (error) {
    console.error('Error fetching supermarket analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
