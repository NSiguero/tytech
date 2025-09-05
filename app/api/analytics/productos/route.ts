import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('API called - fetching productos analytics...');
    
    // Simple test query first
    const testQuery = await executeQuery(`
      SELECT COUNT(*) as total 
      FROM productos_detectados 
      WHERE es_reconocido = 1
    `);
    
    console.log('Test query result:', testQuery);
    
    // Top products query
    const topProductos = await executeQuery(`
      SELECT 
        pd.nombre,
        pd.marca,
        COUNT(*) as detecciones,
        AVG(pd.confidence) as confidence_promedio,
        AVG(pd.facing) as facing_promedio,
        MAX(pd.created_at) as ultima_deteccion
      FROM productos_detectados pd
      WHERE pd.es_reconocido = 1
      GROUP BY pd.nombre, pd.marca
      ORDER BY detecciones DESC
      LIMIT 20
    `);
    
    // Top brands query
    const topMarcas = await executeQuery(`
      SELECT 
        pd.marca,
        COUNT(*) as total_detecciones,
        COUNT(DISTINCT pd.nombre) as productos_unicos,
        AVG(pd.confidence) as confidence_promedio
      FROM productos_detectados pd
      WHERE pd.es_reconocido = 1
      AND pd.marca IS NOT NULL AND pd.marca != ''
      GROUP BY pd.marca
      ORDER BY total_detecciones DESC
      LIMIT 10
    `);
    
    // Facing analysis
    const facingAnalysis = await executeQuery(`
      SELECT 
        pd.nombre,
        pd.marca,
        AVG(pd.facing) as facing_promedio,
        MAX(pd.facing) as facing_maximo,
        COUNT(*) as detecciones
      FROM productos_detectados pd
      WHERE pd.es_reconocido = 1
      AND pd.facing > 0
      GROUP BY pd.nombre, pd.marca
      ORDER BY facing_promedio DESC
      LIMIT 15
    `);
    
    // Recent detections
    const recentDetections = await executeQuery(`
      SELECT 
        pd.nombre,
        pd.marca,
        pd.precio_detectado,
        pd.facing,
        pd.confidence,
        pd.created_at
      FROM productos_detectados pd
      WHERE pd.es_reconocido = 1
      ORDER BY pd.created_at DESC
      LIMIT 15
    `);
    
    // Price analysis with real calculations
    const priceAnalysis = await executeQuery(`
      SELECT 
        pd.nombre,
        pd.marca,
        pd.precio_detectado,
        pd.created_at,
        CAST(REPLACE(REPLACE(REPLACE(pd.precio_detectado, '€', ''), ',', '.'), ' ', '') AS DECIMAL(10,2)) as precio_numerico
      FROM productos_detectados pd
      WHERE pd.es_reconocido = 1
      AND pd.precio_detectado IS NOT NULL 
      AND pd.precio_detectado != ''
      AND pd.precio_detectado REGEXP '^[0-9.,€ ]+$'
      ORDER BY precio_numerico DESC
      LIMIT 30
    `);
    
    // Calculate real price statistics from database
    const priceStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_con_precio,
        AVG(CAST(REPLACE(REPLACE(REPLACE(precio_detectado, '€', ''), ',', '.'), ' ', '') AS DECIMAL(10,2))) as precio_promedio,
        MAX(CAST(REPLACE(REPLACE(REPLACE(precio_detectado, '€', ''), ',', '.'), ' ', '') AS DECIMAL(10,2))) as precio_maximo,
        MIN(CAST(REPLACE(REPLACE(REPLACE(precio_detectado, '€', ''), ',', '.'), ' ', '') AS DECIMAL(10,2))) as precio_minimo
      FROM productos_detectados 
      WHERE es_reconocido = 1
      AND precio_detectado IS NOT NULL 
      AND precio_detectado != ''
      AND precio_detectado REGEXP '^[0-9.,€ ]+$'
      AND CAST(REPLACE(REPLACE(REPLACE(precio_detectado, '€', ''), ',', '.'), ' ', '') AS DECIMAL(10,2)) > 0
    `);
    
    // Calculate median (requires ordered data)
    const medianQuery = await executeQuery(`
      SELECT 
        CAST(REPLACE(REPLACE(REPLACE(precio_detectado, '€', ''), ',', '.'), ' ', '') AS DECIMAL(10,2)) as precio_numerico
      FROM productos_detectados 
      WHERE es_reconocido = 1
      AND precio_detectado IS NOT NULL 
      AND precio_detectado != ''
      AND precio_detectado REGEXP '^[0-9.,€ ]+$'
      AND CAST(REPLACE(REPLACE(REPLACE(precio_detectado, '€', ''), ',', '.'), ' ', '') AS DECIMAL(10,2)) > 0
      ORDER BY precio_numerico
    `);
    
    // Calculate median manually
    const precios = medianQuery.map((row: any) => row.precio_numerico);
    const mediana = precios.length > 0 
      ? precios.length % 2 === 0
        ? (precios[Math.floor(precios.length / 2) - 1] + precios[Math.floor(precios.length / 2)]) / 2
        : precios[Math.floor(precios.length / 2)]
      : 0;
    
    // Calculate basic stats with real price data
    const stats = {
      total_detecciones: testQuery[0]?.total || 0,
      productos_unicos: topProductos.length,
      marcas_unicas: topMarcas.length,
      precio_promedio: Number(priceStats[0]?.precio_promedio || 0).toFixed(2),
      precio_mediano: Number(mediana).toFixed(2),
      precio_maximo: Number(priceStats[0]?.precio_maximo || 0).toFixed(2),
      precio_minimo: Number(priceStats[0]?.precio_minimo || 0).toFixed(2),
      total_con_precio: priceStats[0]?.total_con_precio || 0
    };
    
    console.log('Returning data:', {
      stats,
      top_productos_count: topProductos.length,
      top_marcas_count: topMarcas.length
    });
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        top_productos: topProductos,
        top_marcas: topMarcas,
        productos_caros: priceAnalysis.slice(0, 10),
        detecciones_recientes: recentDetections,
        facing_analysis: facingAnalysis,
        tendencias_precios: priceAnalysis
      }
    });

  } catch (error) {
    console.error('Error fetching product analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}