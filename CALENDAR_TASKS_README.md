# Calendario con Tareas de Agentes - Retail Analytics Dashboard

## Descripción

Se ha implementado la funcionalidad para mostrar las tareas asignadas a cada agente en el calendario. Ahora el calendario muestra tanto visitas como tareas, y al hacer clic en una tarea se muestra su descripción completa.

## Funcionalidades Implementadas

### 1. Visualización de Tareas en el Calendario
- Las tareas aparecen en el día correspondiente a su fecha de vencimiento
- Se muestran con un ícono de check (✓) para diferenciarlas de las visitas
- Las tareas urgentes muestran un ícono de alerta (⚠️)
- Cada tarea muestra su título y prioridad

### 2. Modal de Detalles de Tarea
- Al hacer clic en una tarea se abre un modal con información completa
- Muestra título, descripción, estado, prioridad, categoría
- Incluye fecha de vencimiento, horas estimadas
- Muestra información del agente asignado y quien la asignó
- Lista etiquetas, archivos adjuntos y comentarios
- Permite editar o eliminar la tarea

### 3. API para Obtener Tareas del Agente
- Endpoint: `/api/tasks/agent/[id]`
- Consulta SQL simple que busca tareas asignadas a un agente específico
- Filtra por tareas con fecha de vencimiento y no completadas
- Ordena por fecha de vencimiento y prioridad

### 4. Panel Lateral con Tareas
- Muestra tareas vencidas, de hoy y próximas
- Permite crear nuevas tareas
- Acceso rápido a todas las funcionalidades

## Configuración de la Base de Datos

### 1. Ejecutar el Script SQL
```bash
# Conectar a MySQL y ejecutar:
mysql -u root -p < database-setup.sql
```

### 2. Verificar la Configuración
Asegúrate de que las variables de entorno estén configuradas en tu archivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=t&tech
DB_PORT=3306
```

### 3. Estructura de la Base de Datos
- **Tabla `users`**: Usuarios del sistema
- **Tabla `tasks`**: Tareas con campos como título, descripción, fecha de vencimiento, prioridad, etc.

## Uso del Sistema

### 1. Ver Tareas en el Calendario
- Navega a `/calendar`
- Las tareas aparecen en los días correspondientes
- Se distinguen de las visitas por el ícono de check

### 2. Ver Detalles de una Tarea
- Haz clic en cualquier tarea del calendario
- Se abre el modal con información completa
- Puedes editar o eliminar la tarea desde ahí

### 3. Crear Nueva Tarea
- Usa el botón "Crear Tarea" en el panel lateral
- Completa el formulario con título, descripción y fecha
- La tarea se crea y aparece en el calendario

### 4. Gestionar Tareas
- El panel lateral muestra tareas vencidas, de hoy y próximas
- Puedes ver detalles de cada tarea
- Acceso rápido a todas las funcionalidades

## Consulta SQL Implementada

La funcionalidad utiliza esta consulta SQL simple para obtener las tareas del agente:

```sql
SELECT t.*, 
       CONCAT(u1.first_name, ' ', u1.last_name) as assigned_by_name,
       CONCAT(u2.first_name, ' ', u2.last_name) as assigned_to_name
FROM tasks t
LEFT JOIN users u1 ON t.assigned_by = u1.id
LEFT JOIN users u2 ON t.assigned_to = u2.id
WHERE t.assigned_to = ? 
  AND t.due_date IS NOT NULL
  AND t.status != 'completed'
ORDER BY t.due_date ASC, t.priority DESC
```

## Archivos Modificados/Creados

### Nuevos Archivos:
- `app/api/tasks/agent/[id]/route.ts` - API endpoint para tareas del agente
- `components/task-detail-modal.tsx` - Modal de detalles de tarea
- `database-setup.sql` - Script de configuración de la base de datos
- `CALENDAR_TASKS_README.md` - Este archivo de documentación

### Archivos Modificados:
- `lib/tasks.ts` - Agregada función `getTasksForAgentCalendar`
- `components/calendar/calendar-grid.tsx` - Integración de tareas en el calendario
- `app/calendar/page.tsx` - Carga de tareas del agente y manejo de eventos
- `components/task-modal.tsx` - Actualizado para trabajar con la nueva interfaz
- `components/calendar/assigned-visits.tsx` - Integración de tareas en el panel lateral

## Personalización

### Cambiar el ID del Agente
En `app/calendar/page.tsx`, línea 58, cambia el ID del agente:

```typescript
const agentId = 1 // Cambia por el ID del usuario actual
```

### Modificar Colores de Prioridad
En `components/calendar/calendar-grid.tsx`, función `getTaskPriorityColor`:

```typescript
const getTaskPriorityColor = (priority: string) => {
  switch (priority) {
    case "low": return "bg-green-100 text-green-700 border-green-200"
    case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "high": return "bg-orange-100 text-orange-700 border-orange-200"
    case "urgent": return "bg-red-100 text-red-700 border-red-200"
    default: return "bg-gray-100 text-gray-700 border-gray-200"
  }
}
```

## Próximas Mejoras

1. **Autenticación Real**: Integrar con sistema de autenticación para obtener el ID del usuario actual
2. **Filtros Avanzados**: Agregar filtros por categoría, prioridad y estado
3. **Drag & Drop**: Permitir arrastrar tareas entre fechas
4. **Notificaciones**: Alertas para tareas próximas a vencer
5. **Sincronización**: Sincronización en tiempo real con la base de datos

## Solución de Problemas

### Las tareas no aparecen en el calendario
1. Verifica que la base de datos esté configurada correctamente
2. Revisa la consola del navegador para errores de API
3. Confirma que el ID del agente sea correcto

### Error al cargar tareas
1. Verifica la conexión a la base de datos
2. Revisa que las tablas existan y tengan datos
3. Confirma que el endpoint API esté funcionando

### Problemas de visualización
1. Verifica que los estilos CSS estén cargados
2. Revisa la consola para errores de JavaScript
3. Confirma que los componentes estén importados correctamente

## Soporte

Para problemas o preguntas sobre esta funcionalidad, revisa:
1. Los logs de la consola del navegador
2. Los logs del servidor Next.js
3. La documentación de los componentes utilizados
