import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get KPI data from tasks and users
    const kpiQueries = await Promise.all([
      // Total tasks and their distribution
      executeQuery(`
        SELECT 
          COUNT(*) as total_tareas,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as tareas_completadas,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as tareas_pendientes,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as tareas_en_progreso,
          COUNT(CASE WHEN category = 'visita' THEN 1 END) as total_visitas,
          COUNT(CASE WHEN category = 'reporte' THEN 1 END) as total_reportes,
          COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as tareas_urgentes,
          COUNT(CASE WHEN due_date < NOW() AND status != 'completed' THEN 1 END) as tareas_vencidas
        FROM tasks
      `),

      // Performance metrics
      executeQuery(`
        SELECT 
          AVG(actual_hours) as promedio_horas_reales,
          AVG(estimated_hours) as promedio_horas_estimadas,
          SUM(actual_hours) as total_horas_trabajadas,
          COUNT(DISTINCT assigned_to) as agentes_activos,
          COUNT(DISTINCT cadena_supermercado) as cadenas_visitadas,
          COUNT(DISTINCT area) as areas_cubiertas
        FROM tasks 
        WHERE actual_hours IS NOT NULL OR estimated_hours IS NOT NULL
      `),

      // Team performance
      executeQuery(`
        SELECT 
          COUNT(DISTINCT id) as total_usuarios,
          COUNT(DISTINCT CASE WHEN role = 'field_agent' THEN id END) as total_agentes,
          COUNT(DISTINCT CASE WHEN role = 'manager' THEN id END) as total_managers,
          COUNT(DISTINCT team_code) as total_equipos
        FROM users 
        WHERE is_active = 1
      `),

      // Supermarket coverage
      executeQuery(`
        SELECT 
          COUNT(*) as total_supermercados,
          COUNT(DISTINCT area) as areas_disponibles,
          COUNT(DISTINCT cadena) as cadenas_disponibles,
          AVG(CAST(snacks AS DECIMAL(10,3))) as promedio_snacks,
          AVG(CAST(cereales AS DECIMAL(10,3))) as promedio_cereales
        FROM total_mercado
      `),

      // Recent activity (last 30 days)
      executeQuery(`
        SELECT 
          COUNT(*) as actividad_reciente,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completadas_recientes,
          COUNT(DISTINCT assigned_to) as agentes_activos_recientes
        FROM tasks 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `)
    ]);

    const [taskStats, performanceStats, teamStats, supermarketStats, recentActivity] = kpiQueries;

    const kpis = {
      // Task metrics
      total_tareas: taskStats[0]?.total_tareas || 0,
      tareas_completadas: taskStats[0]?.tareas_completadas || 0,
      tareas_pendientes: taskStats[0]?.tareas_pendientes || 0,
      tareas_en_progreso: taskStats[0]?.tareas_en_progreso || 0,
      total_visitas: taskStats[0]?.total_visitas || 0,
      total_reportes: taskStats[0]?.total_reportes || 0,
      tareas_urgentes: taskStats[0]?.tareas_urgentes || 0,
      tareas_vencidas: taskStats[0]?.tareas_vencidas || 0,

      // Performance metrics
      promedio_horas_reales: parseFloat(performanceStats[0]?.promedio_horas_reales || 0),
      promedio_horas_estimadas: parseFloat(performanceStats[0]?.promedio_horas_estimadas || 0),
      total_horas_trabajadas: parseFloat(performanceStats[0]?.total_horas_trabajadas || 0),
      agentes_activos: performanceStats[0]?.agentes_activos || 0,
      cadenas_visitadas: performanceStats[0]?.cadenas_visitadas || 0,
      areas_cubiertas: performanceStats[0]?.areas_cubiertas || 0,

      // Team metrics
      total_usuarios: teamStats[0]?.total_usuarios || 0,
      total_agentes: teamStats[0]?.total_agentes || 0,
      total_managers: teamStats[0]?.total_managers || 0,
      total_equipos: teamStats[0]?.total_equipos || 0,

      // Market coverage
      total_supermercados: supermarketStats[0]?.total_supermercados || 0,
      areas_disponibles: supermarketStats[0]?.areas_disponibles || 0,
      cadenas_disponibles: supermarketStats[0]?.cadenas_disponibles || 0,
      promedio_snacks: parseFloat(supermarketStats[0]?.promedio_snacks || 0),
      promedio_cereales: parseFloat(supermarketStats[0]?.promedio_cereales || 0),

      // Recent activity
      actividad_reciente: recentActivity[0]?.actividad_reciente || 0,
      completadas_recientes: recentActivity[0]?.completadas_recientes || 0,
      agentes_activos_recientes: recentActivity[0]?.agentes_activos_recientes || 0,

      // Calculated metrics
      tasa_completacion: taskStats[0]?.total_tareas > 0 
        ? ((taskStats[0]?.tareas_completadas || 0) / taskStats[0]?.total_tareas * 100).toFixed(1)
        : 0,
      eficiencia_horaria: performanceStats[0]?.promedio_horas_estimadas > 0 
        ? ((performanceStats[0]?.promedio_horas_reales || 0) / performanceStats[0]?.promedio_horas_estimadas * 100).toFixed(1)
        : 0,
      cobertura_supermercados: supermarketStats[0]?.total_supermercados > 0 
        ? ((performanceStats[0]?.cadenas_visitadas || 0) / supermarketStats[0]?.cadenas_disponibles * 100).toFixed(1)
        : 0
    };

    return NextResponse.json({
      success: true,
      data: kpis
    });

  } catch (error) {
    console.error('Error fetching KPI analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
