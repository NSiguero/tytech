-- Script para configurar la base de datos con tareas de ejemplo
-- Ejecutar este script en tu base de datos MySQL

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `t&tech`;
USE `t&tech`;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'agent',
  `team_code` varchar(20) DEFAULT NULL,
  `is_team_manager` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Crear tabla de tareas si no existe
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` enum('visita', 'reporte') NOT NULL DEFAULT 'reporte',
  `status` enum('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `priority` enum('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `assigned_by` int(11) NOT NULL,
  `assigned_to` int(11) NOT NULL,
  `team_code` varchar(20) NOT NULL,
  `due_date` datetime,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` datetime,
  `estimated_hours` decimal(4,2),
  `actual_hours` decimal(4,2),
  `tags` json,
  `attachments` json,
  `comments` json,
  `history` json,
  PRIMARY KEY (`id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `assigned_by` (`assigned_by`),
  KEY `team_code` (`team_code`),
  KEY `due_date` (`due_date`),
  KEY `status` (`status`),
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Insertar usuarios de ejemplo
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `role`, `team_code`, `is_team_manager`) VALUES
('Juan', 'Pérez', 'juan.perez@empresa.com', '$2b$10$example', 'agent', 'TEAM001', FALSE),
('María', 'García', 'maria.garcia@empresa.com', '$2b$10$example', 'agent', 'TEAM001', FALSE),
('Carlos', 'López', 'carlos.lopez@empresa.com', '$2b$10$example', 'manager', 'TEAM001', TRUE),
('Ana', 'Martínez', 'ana.martinez@empresa.com', '$2b$10$example', 'agent', 'TEAM002', FALSE),
('Luis', 'Rodríguez', 'luis.rodriguez@empresa.com', '$2b$10$example', 'manager', 'TEAM002', TRUE);

-- Insertar tareas de ejemplo para el agente Juan Pérez (ID: 1)
INSERT INTO `tasks` (`title`, `description`, `category`, `status`, `priority`, `assigned_by`, `assigned_to`, `team_code`, `due_date`, `estimated_hours`, `tags`) VALUES
('Revisar inventario del supermercado Central', 'Verificar stock de productos frescos y perecederos', 'visita', 'pending', 'high', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 1 DAY), 2.5, '["inventario", "frescos", "urgente"]'),
('Preparar reporte de ventas mensual', 'Recopilar datos de ventas y generar análisis comparativo', 'reporte', 'pending', 'medium', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 3 DAY), 4.0, '["ventas", "análisis", "mensual"]'),
('Visita de seguimiento al cliente Premium', 'Revisar satisfacción del cliente y oportunidades de venta', 'visita', 'in_progress', 'high', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 5 DAY), 3.0, '["cliente", "seguimiento", "premium"]'),
('Actualizar base de datos de productos', 'Sincronizar información de productos con el sistema central', 'reporte', 'pending', 'low', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 7 DAY), 1.5, '["base de datos", "sincronización"]'),
('Reunión de equipo semanal', 'Coordinación de actividades y revisión de objetivos', 'reporte', 'pending', 'medium', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 2 DAY), 1.0, '["reunión", "equipo", "coordinación"]'),
('Auditoría de calidad en tienda Norte', 'Verificar estándares de calidad y presentación', 'visita', 'pending', 'urgent', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 1 DAY), 2.0, '["auditoría", "calidad", "tienda"]'),
('Preparar presentación para junta directiva', 'Crear slides con métricas de rendimiento del equipo', 'reporte', 'pending', 'high', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 4 DAY), 3.5, '["presentación", "métricas", "directiva"]'),
('Capacitación en nuevo software', 'Aprender funcionalidades del sistema de gestión actualizado', 'reporte', 'pending', 'medium', 3, 1, 'TEAM001', DATE_ADD(NOW(), INTERVAL 6 DAY), 2.0, '["capacitación", "software", "sistema"]');

-- Insertar tareas de ejemplo para la agente María García (ID: 2)
INSERT INTO `tasks` (`title`, `description`, `category`, `status`, `priority`, `assigned_by`, `assigned_to`, `team_code`, `due_date`, `estimated_hours`, `tags`) VALUES
('Revisión de productos en tienda Sur', 'Verificar disponibilidad y estado de productos', 'visita', 'pending', 'medium', 3, 2, 'TEAM001', DATE_ADD(NOW(), INTERVAL 1 DAY), 2.0, '["productos", "tienda", "disponibilidad"]'),
('Análisis de competencia local', 'Investigar precios y estrategias de la competencia', 'reporte', 'pending', 'high', 3, 2, 'TEAM001', DATE_ADD(NOW(), INTERVAL 2 DAY), 3.0, '["competencia", "análisis", "precios"]'),
('Preparar agenda de visitas semanal', 'Organizar cronograma de visitas a clientes', 'reporte', 'in_progress', 'medium', 3, 2, 'TEAM001', DATE_ADD(NOW(), INTERVAL 1 DAY), 1.5, '["agenda", "visitas", "cronograma"]');

-- Insertar comentarios de ejemplo en algunas tareas
UPDATE `tasks` SET `comments` = JSON_ARRAY(
  JSON_OBJECT(
    'id', '1',
    'user_id', 3,
    'user_name', 'Carlos López',
    'comment', 'Importante revisar especialmente los productos lácteos',
    'created_at', NOW()
  )
) WHERE `id` = 1;

UPDATE `tasks` SET `comments` = JSON_ARRAY(
  JSON_OBJECT(
    'id', '2',
    'user_id', 3,
    'user_name', 'Carlos López',
    'comment', 'Incluir comparación con el mes anterior',
    'created_at', NOW()
  ),
  JSON_OBJECT(
    'id', '3',
    'user_id', 1,
    'user_name', 'Juan Pérez',
    'comment', 'Cliente muy satisfecho con el servicio',
    'created_at', NOW()
  )
) WHERE `id` = 2;

-- Insertar historial de ejemplo en algunas tareas
UPDATE `tasks` SET `history` = JSON_ARRAY(
  JSON_OBJECT(
    'id', '1',
    'user_id', 3,
    'user_name', 'Carlos López',
    'action', 'created',
    'new_value', JSON_OBJECT('title', 'Revisar inventario del supermercado Central'),
    'created_at', NOW()
  )
) WHERE `id` = 1;

-- Mostrar las tareas creadas
SELECT 
  t.id,
  t.title,
  t.category,
  t.status,
  t.priority,
  t.due_date,
  CONCAT(u.first_name, ' ', u.last_name) as assigned_to_name,
  CONCAT(ub.first_name, ' ', ub.last_name) as assigned_by_name
FROM tasks t
JOIN users u ON t.assigned_to = u.id
JOIN users ub ON t.assigned_by = ub.id
ORDER BY t.due_date ASC;
