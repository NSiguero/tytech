import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const supermercadoId = url.searchParams.get('supermercado_id');
    const cadena = url.searchParams.get('cadena');

    if (!supermercadoId && !cadena) {
      return NextResponse.json(
        { success: false, error: 'Se requiere supermercado_id o cadena' },
        { status: 400 }
      );
    }

    // Query to get products detected in specific supermarket/chain visits
    let query = `
      SELECT 
        pd.nombre,
        pd.marca,
        pd.precio_detectado,
        pd.facing,
        pd.confidence,
        pd.created_at,
        COUNT(*) as veces_detectado,
        AVG(pd.confidence) as confidence_promedio,
        AVG(pd.facing) as facing_promedio,
        MAX(pd.created_at) as ultima_deteccion,
        CONCAT(u.first_name, ' ', u.last_name) as ultimo_usuario,
        t.title as visita_titulo,
        tm.rotulo as supermercado_nombre,
        tm.cadena as cadena_supermercado
      FROM productos_detectados pd
      INNER JOIN user_uploads uu ON pd.foto_id = uu.id
      INNER JOIN users u ON uu.user_id = u.id
      LEFT JOIN tasks t ON (t.assigned_to = u.id AND t.category = 'visita')
      LEFT JOIN total_mercado tm ON t.supermercado_id = tm.id
      WHERE pd.es_reconocido = 1
    `;

    const params: any[] = [];

    if (supermercadoId) {
      query += ` AND t.supermercado_id = ?`;
      params.push(supermercadoId);
    }

    if (cadena) {
      query += ` AND t.cadena_supermercado = ?`;
      params.push(cadena);
    }

    query += `
      GROUP BY pd.nombre, pd.marca, tm.rotulo, tm.cadena
      ORDER BY veces_detectado DESC, confidence_promedio DESC
      LIMIT 50
    `;

    const productos = await executeQuery(query, params);

    // Get summary stats for this supermercado/cadena
    let statsQuery = `
      SELECT 
        COUNT(*) as total_detecciones,
        COUNT(DISTINCT pd.nombre) as productos_unicos,
        COUNT(DISTINCT pd.marca) as marcas_unicas,
        AVG(pd.confidence) as confidence_promedio,
        AVG(pd.facing) as facing_promedio
      FROM productos_detectados pd
      INNER JOIN user_uploads uu ON pd.foto_id = uu.id
      INNER JOIN users u ON uu.user_id = u.id
      LEFT JOIN tasks t ON (t.assigned_to = u.id AND t.category = 'visita')
      WHERE pd.es_reconocido = 1
    `;

    const statsParams: any[] = [];

    if (supermercadoId) {
      statsQuery += ` AND t.supermercado_id = ?`;
      statsParams.push(supermercadoId);
    }

    if (cadena) {
      statsQuery += ` AND t.cadena_supermercado = ?`;
      statsParams.push(cadena);
    }

    const [stats] = await executeQuery(statsQuery, statsParams);

    // Get price analysis
    let priceQuery = `
      SELECT 
        pd.nombre,
        pd.marca,
        pd.precio_detectado,
        CAST(REPLACE(REPLACE(pd.precio_detectado, '€', ''), ',', '.') AS DECIMAL(10,2)) as precio_numerico
      FROM productos_detectados pd
      INNER JOIN user_uploads uu ON pd.foto_id = uu.id
      INNER JOIN users u ON uu.user_id = u.id
      LEFT JOIN tasks t ON (t.assigned_to = u.id AND t.category = 'visita')
      WHERE pd.es_reconocido = 1 
      AND pd.precio_detectado IS NOT NULL 
      AND pd.precio_detectado != ''
      AND pd.precio_detectado REGEXP '^[0-9.,]+[[:space:]]*€?$'
    `;

    const priceParams: any[] = [];

    if (supermercadoId) {
      priceQuery += ` AND t.supermercado_id = ?`;
      priceParams.push(supermercadoId);
    }

    if (cadena) {
      priceQuery += ` AND t.cadena_supermercado = ?`;
      priceParams.push(cadena);
    }

    priceQuery += ` ORDER BY precio_numerico DESC LIMIT 20`;

    const precios = await executeQuery(priceQuery, priceParams);

    // Calculate price statistics
    const preciosNumericos = precios
      .map((p: any) => p.precio_numerico)
      .filter((p: number) => p > 0)
      .sort((a: number, b: number) => a - b);

    const priceStats = {
      precio_promedio: preciosNumericos.length > 0 
        ? (preciosNumericos.reduce((a: number, b: number) => a + b, 0) / preciosNumericos.length).toFixed(2)
        : '0',
      precio_maximo: preciosNumericos.length > 0
        ? Math.max(...preciosNumericos).toFixed(2)
        : '0',
      precio_minimo: preciosNumericos.length > 0
        ? Math.min(...preciosNumericos.filter(p => p > 0)).toFixed(2)
        : '0'
    };

    return NextResponse.json({
      success: true,
      data: {
        supermercado_info: productos[0] ? {
          nombre: productos[0].supermercado_nombre,
          cadena: productos[0].cadena_supermercado
        } : null,
        stats: {
          ...stats,
          ...priceStats
        },
        productos,
        productos_caros: precios.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Error fetching supermercado product analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
