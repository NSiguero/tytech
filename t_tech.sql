-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-09-2025 a las 10:48:33
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `t&tech`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_detectados`
--

CREATE TABLE `productos_detectados` (
  `id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `producto_id` varchar(255) DEFAULT NULL,
  `nombre` varchar(500) NOT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `facing` int(11) DEFAULT 0,
  `precio_detectado` varchar(100) DEFAULT NULL,
  `es_reconocido` tinyint(1) DEFAULT 1,
  `confidence` decimal(5,4) DEFAULT NULL,
  `bounding_box` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bounding_box`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos_detectados`
--

INSERT INTO `productos_detectados` (`id`, `foto_id`, `producto_id`, `nombre`, `marca`, `facing`, `precio_detectado`, `es_reconocido`, `confidence`, `bounding_box`, `created_at`) VALUES
(262, 53, NULL, 'Gullón Zero Sin Azúcares María Dorada', 'Gull', 6, '1.29 €', 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(263, 53, NULL, 'Gullón Bio Organic', 'Gull', 2, '3.49 €', 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(264, 53, NULL, 'Fontaneda Digestive', 'Fontaneda', 3, '2.70 €', 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(265, 53, NULL, 'Fontaneda Finas', 'Fontaneda', 3, NULL, 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(266, 53, NULL, 'Carolina', 'Carolina', 4, NULL, 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(267, 53, NULL, 'Gullón Zero Sin Azúcares', 'Gull', 5, '2.95 €', 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(268, 53, NULL, 'Fontaneda María Dorada', 'Fontaneda', 5, NULL, 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(269, 53, NULL, 'AvenaCol', 'Avena', 2, NULL, 1, '0.9500', NULL, '2025-08-15 18:57:36'),
(270, 54, NULL, 'Gullón Zero Sin Azúcares María Dorada', 'Gull', 5, '2.48 €', 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(271, 54, NULL, 'Gullón Bio Organic', 'Gull', 2, '3.49 €', 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(272, 54, NULL, 'Fontaneda Digestive', 'Fontaneda', 2, '3.29 €', 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(273, 54, NULL, 'Carolina Zero Sugar', 'Carolina', 3, '2.35 €', 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(274, 54, NULL, 'Fontaneda María', 'Fontaneda', 4, '2.29 €', 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(275, 54, NULL, 'Gullón Zero Sin Azúcares', 'Gull', 4, '2.85 €', 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(276, 54, NULL, 'Fontaneda Finas', 'Fontaneda', 3, '1.99 €', 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(277, 54, NULL, 'Gullón Crème Tropical', 'Gull', 1, NULL, 1, '0.9500', NULL, '2025-08-19 07:56:31'),
(278, 55, NULL, 'Gullón Zero Sin Azúcares María Dorada', 'Gull', 5, '2.48 €', 1, '0.9500', NULL, '2025-08-27 19:48:47'),
(279, 55, NULL, 'Gullón Bio Organic', 'Gull', 2, '1.29 €', 1, '0.9500', NULL, '2025-08-27 19:48:47'),
(280, 55, NULL, 'Fontaneda Digestive', 'Fontaneda', 5, '3.29 €', 1, '0.9500', NULL, '2025-08-27 19:48:47'),
(281, 55, NULL, 'Carolina Zero Sugar', 'Carolina', 3, '3.58 €', 1, '0.9500', NULL, '2025-08-27 19:48:47'),
(282, 55, NULL, 'Gullón Zero Sin Azúcares', 'Gull', 4, '2.95 €', 1, '0.9500', NULL, '2025-08-27 19:48:47'),
(283, 55, NULL, 'Fontaneda María', 'Fontaneda', 3, '2.85 €', 1, '0.9500', NULL, '2025-08-27 19:48:47'),
(284, 56, NULL, 'Ybarra Espárragos', 'Ybarra', 3, '1,00 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(285, 56, NULL, 'Ybarra Judías Verdes', 'Ybarra', 3, '0,85 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(286, 56, NULL, 'Ybarra Alcachofas', 'Ybarra', 2, '1,80 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(287, 56, NULL, 'Hacendado Menestra', 'Hacendado', 2, '1,60 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(288, 56, NULL, 'Maíz Dulce', 'Ma', 8, '1,19 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(289, 56, NULL, 'Bonduelle Maíz Dulce', 'Bonduelle', 4, '0,95 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(290, 56, NULL, 'Bonduelle Guisantes', 'Bonduelle', 3, '0,79 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(291, 56, NULL, 'Bonduelle Champiñones', 'Bonduelle', 3, '0,93 €', 1, '0.9500', NULL, '2025-08-27 20:00:58'),
(292, 57, NULL, 'Ybarra Espárragos', 'Ybarra', 3, '1,08 €', 1, '0.9500', NULL, '2025-08-27 22:04:55'),
(293, 57, NULL, 'Ybarra Alcachofas', 'Ybarra', 3, '1,00 €', 1, '0.9500', NULL, '2025-08-27 22:04:55'),
(294, 57, NULL, 'Ybarra Judías Verdes', 'Ybarra', 3, '0,75 €', 1, '0.9500', NULL, '2025-08-27 22:04:55'),
(295, 57, NULL, 'Hacendado Menestra', 'Hacendado', 2, '2,20 €', 1, '0.9500', NULL, '2025-08-27 22:04:55'),
(296, 57, NULL, 'Maíz Dulce', 'Ma', 6, '1,49 €', 1, '0.9500', NULL, '2025-08-27 22:04:55'),
(297, 57, NULL, 'Bonduelle Champiñones', 'Bonduelle', 3, '1,50 €', 1, '0.9500', NULL, '2025-08-27 22:04:55'),
(298, 57, NULL, 'Bonduelle Guisantes', 'Bonduelle', 3, '0,57 €', 1, '0.9500', NULL, '2025-08-27 22:04:55'),
(299, 57, NULL, 'Bonduelle Judías Verdes', 'Bonduelle', 3, '0,93 €', 1, '0.9500', NULL, '2025-08-27 22:04:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` enum('visita','reporte') DEFAULT 'visita',
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `assigned_by` int(11) NOT NULL,
  `assigned_to` int(11) NOT NULL,
  `due_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  `estimated_hours` decimal(4,2) DEFAULT NULL,
  `actual_hours` decimal(4,2) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`comments`)),
  `history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`history`)),
  `team_code` varchar(10) DEFAULT NULL,
  `cadena_supermercado` varchar(100) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `category`, `status`, `priority`, `assigned_by`, `assigned_to`, `due_date`, `created_at`, `updated_at`, `completed_at`, `estimated_hours`, `actual_hours`, `tags`, `attachments`, `comments`, `history`, `team_code`, `cadena_supermercado`, `area`) VALUES
(10, 'Mercadona', 'Test', 'visita', 'completed', 'medium', 5, 6, '2025-08-28 00:00:00', '2025-08-27 19:47:56', '2025-08-27 19:48:39', '2025-08-27 13:48:39', '3.00', NULL, '[]', NULL, '[]', '[{\"id\":\"1756324076552\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"Test\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"estimated_hours\":3,\"tags\":[]},\"created_at\":\"2025-08-27T19:47:56.552Z\"},{\"id\":\"1756324092198\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":10,\"title\":\"Mercadona\",\"description\":\"Test\",\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"medium\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"created_at\":\"2025-08-27T19:47:56.000Z\",\"updated_at\":\"2025-08-27T19:47:56.000Z\",\"completed_at\":null,\"estimated_hours\":\"3.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756324076552\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"Test\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"estimated_hours\":3,\"tags\":[]},\"created_at\":\"2025-08-27T19:47:56.552Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T19:48:12.198Z\"},{\"id\":\"1756324119841\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":10,\"title\":\"Mercadona\",\"description\":\"Test\",\"category\":\"visita\",\"status\":\"in_progress\",\"priority\":\"medium\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"created_at\":\"2025-08-27T19:47:56.000Z\",\"updated_at\":\"2025-08-27T19:48:12.000Z\",\"completed_at\":null,\"estimated_hours\":\"3.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756324076552\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"Test\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"estimated_hours\":3,\"tags\":[]},\"created_at\":\"2025-08-27T19:47:56.552Z\"},{\"id\":\"1756324092198\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":10,\"title\":\"Mercadona\",\"description\":\"Test\",\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"medium\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"created_at\":\"2025-08-27T19:47:56.000Z\",\"updated_at\":\"2025-08-27T19:47:56.000Z\",\"completed_at\":null,\"estimated_hours\":\"3.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756324076552\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"Test\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"estimated_hours\":3,\"tags\":[]},\"created_at\":\"2025-08-27T19:47:56.552Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T19:48:12.198Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"completed\"},\"created_at\":\"2025-08-27T19:48:39.841Z\"}]', 'GWG8XN', NULL, NULL),
(11, 'Tets2', 'ifeibfe', 'visita', 'completed', 'high', 5, 6, '2025-08-29 00:00:00', '2025-08-27 20:00:30', '2025-08-27 20:00:51', '2025-08-27 14:00:51', '2.00', NULL, '[]', NULL, '[]', '[{\"id\":\"1756324830472\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Tets2\",\"description\":\"ifeibfe\",\"category\":\"visita\",\"priority\":\"high\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T20:00:30.472Z\"},{\"id\":\"1756324843139\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":11,\"title\":\"Tets2\",\"description\":\"ifeibfe\",\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"high\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"created_at\":\"2025-08-27T20:00:30.000Z\",\"updated_at\":\"2025-08-27T20:00:30.000Z\",\"completed_at\":null,\"estimated_hours\":\"2.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756324830472\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Tets2\",\"description\":\"ifeibfe\",\"category\":\"visita\",\"priority\":\"high\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T20:00:30.472Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T20:00:43.140Z\"},{\"id\":\"1756324851646\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":11,\"title\":\"Tets2\",\"description\":\"ifeibfe\",\"category\":\"visita\",\"status\":\"in_progress\",\"priority\":\"high\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"created_at\":\"2025-08-27T20:00:30.000Z\",\"updated_at\":\"2025-08-27T20:00:43.000Z\",\"completed_at\":null,\"estimated_hours\":\"2.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756324830472\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Tets2\",\"description\":\"ifeibfe\",\"category\":\"visita\",\"priority\":\"high\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T20:00:30.472Z\"},{\"id\":\"1756324843139\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":11,\"title\":\"Tets2\",\"description\":\"ifeibfe\",\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"high\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"created_at\":\"2025-08-27T20:00:30.000Z\",\"updated_at\":\"2025-08-27T20:00:30.000Z\",\"completed_at\":null,\"estimated_hours\":\"2.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756324830472\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Tets2\",\"description\":\"ifeibfe\",\"category\":\"visita\",\"priority\":\"high\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T20:00:30.472Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T20:00:43.140Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"completed\"},\"created_at\":\"2025-08-27T20:00:51.646Z\"}]', 'GWG8XN', NULL, NULL),
(12, 'Mercadona', 'wdwdw', 'visita', 'completed', 'medium', 5, 6, '2025-08-30 00:00:00', '2025-08-27 20:06:30', '2025-08-27 21:18:09', '2025-08-27 15:18:09', '1.00', NULL, '[]', NULL, '[]', '[{\"id\":\"1756325190102\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"wdwdw\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-30T06:00:00.000Z\",\"estimated_hours\":1,\"tags\":[]},\"created_at\":\"2025-08-27T20:06:30.102Z\"},{\"id\":\"1756329482717\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":12,\"title\":\"Mercadona\",\"description\":\"wdwdw\",\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"medium\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-30T06:00:00.000Z\",\"created_at\":\"2025-08-27T20:06:30.000Z\",\"updated_at\":\"2025-08-27T20:06:30.000Z\",\"completed_at\":null,\"estimated_hours\":\"1.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756325190102\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"wdwdw\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-30T06:00:00.000Z\",\"estimated_hours\":1,\"tags\":[]},\"created_at\":\"2025-08-27T20:06:30.102Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T21:18:02.717Z\"},{\"id\":\"1756329489377\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":12,\"title\":\"Mercadona\",\"description\":\"wdwdw\",\"category\":\"visita\",\"status\":\"in_progress\",\"priority\":\"medium\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-30T06:00:00.000Z\",\"created_at\":\"2025-08-27T20:06:30.000Z\",\"updated_at\":\"2025-08-27T21:18:02.000Z\",\"completed_at\":null,\"estimated_hours\":\"1.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756325190102\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"wdwdw\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-30T06:00:00.000Z\",\"estimated_hours\":1,\"tags\":[]},\"created_at\":\"2025-08-27T20:06:30.102Z\"},{\"id\":\"1756329482717\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":12,\"title\":\"Mercadona\",\"description\":\"wdwdw\",\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"medium\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-30T06:00:00.000Z\",\"created_at\":\"2025-08-27T20:06:30.000Z\",\"updated_at\":\"2025-08-27T20:06:30.000Z\",\"completed_at\":null,\"estimated_hours\":\"1.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756325190102\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona\",\"description\":\"wdwdw\",\"category\":\"visita\",\"priority\":\"medium\",\"assigned_to\":6,\"due_date\":\"2025-08-30T06:00:00.000Z\",\"estimated_hours\":1,\"tags\":[]},\"created_at\":\"2025-08-27T20:06:30.102Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T21:18:02.717Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"completed\"},\"created_at\":\"2025-08-27T21:18:09.377Z\"}]', 'GWG8XN', NULL, NULL),
(13, 'Test', NULL, 'visita', 'completed', 'urgent', 5, 6, NULL, '2025-08-27 21:25:13', '2025-08-27 21:25:24', '2025-08-27 15:25:24', NULL, NULL, '[]', NULL, '[]', '[{\"id\":\"1756329913949\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Test\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"tags\":[]},\"created_at\":\"2025-08-27T21:25:13.949Z\"},{\"id\":\"1756329920880\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":13,\"title\":\"Test\",\"description\":null,\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"urgent\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":null,\"created_at\":\"2025-08-27T21:25:13.000Z\",\"updated_at\":\"2025-08-27T21:25:13.000Z\",\"completed_at\":null,\"estimated_hours\":null,\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756329913949\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Test\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"tags\":[]},\"created_at\":\"2025-08-27T21:25:13.949Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T21:25:20.880Z\"},{\"id\":\"1756329924420\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":13,\"title\":\"Test\",\"description\":null,\"category\":\"visita\",\"status\":\"in_progress\",\"priority\":\"urgent\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":null,\"created_at\":\"2025-08-27T21:25:13.000Z\",\"updated_at\":\"2025-08-27T21:25:20.000Z\",\"completed_at\":null,\"estimated_hours\":null,\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756329913949\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Test\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"tags\":[]},\"created_at\":\"2025-08-27T21:25:13.949Z\"},{\"id\":\"1756329920880\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":13,\"title\":\"Test\",\"description\":null,\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"urgent\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":null,\"created_at\":\"2025-08-27T21:25:13.000Z\",\"updated_at\":\"2025-08-27T21:25:13.000Z\",\"completed_at\":null,\"estimated_hours\":null,\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756329913949\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Test\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"tags\":[]},\"created_at\":\"2025-08-27T21:25:13.949Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T21:25:20.880Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"completed\"},\"created_at\":\"2025-08-27T21:25:24.420Z\"}]', 'GWG8XN', NULL, NULL),
(14, 'Test3', NULL, 'visita', 'pending', 'urgent', 5, 6, '2025-08-28 00:00:00', '2025-08-27 21:25:43', '2025-08-27 21:25:43', NULL, '2.00', NULL, '[]', NULL, '[]', '[{\"id\":\"1756329943516\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Test3\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"due_date\":\"2025-08-28T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T21:25:43.516Z\"}]', 'GWG8XN', NULL, NULL),
(15, 'Mercadona Centro', NULL, 'visita', 'completed', 'urgent', 5, 6, '2025-08-29 00:00:00', '2025-08-27 22:03:21', '2025-08-27 22:04:46', '2025-08-27 16:04:46', '2.00', NULL, '[]', NULL, '[]', '[{\"id\":\"1756332201982\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona Centro\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T22:03:21.982Z\"},{\"id\":\"1756332264793\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":15,\"title\":\"Mercadona Centro\",\"description\":null,\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"urgent\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"created_at\":\"2025-08-27T22:03:21.000Z\",\"updated_at\":\"2025-08-27T22:03:21.000Z\",\"completed_at\":null,\"estimated_hours\":\"2.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756332201982\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona Centro\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T22:03:21.982Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T22:04:24.793Z\"},{\"id\":\"1756332286015\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":15,\"title\":\"Mercadona Centro\",\"description\":null,\"category\":\"visita\",\"status\":\"in_progress\",\"priority\":\"urgent\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"created_at\":\"2025-08-27T22:03:21.000Z\",\"updated_at\":\"2025-08-27T22:04:24.000Z\",\"completed_at\":null,\"estimated_hours\":\"2.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756332201982\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona Centro\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T22:03:21.982Z\"},{\"id\":\"1756332264793\",\"user_name\":\"System\",\"action\":\"updated\",\"old_value\":{\"id\":15,\"title\":\"Mercadona Centro\",\"description\":null,\"category\":\"visita\",\"status\":\"pending\",\"priority\":\"urgent\",\"assigned_by\":5,\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"created_at\":\"2025-08-27T22:03:21.000Z\",\"updated_at\":\"2025-08-27T22:03:21.000Z\",\"completed_at\":null,\"estimated_hours\":\"2.00\",\"actual_hours\":null,\"tags\":[],\"attachments\":null,\"comments\":[],\"history\":[{\"id\":\"1756332201982\",\"user_id\":5,\"user_name\":\"System\",\"action\":\"created\",\"new_value\":{\"title\":\"Mercadona Centro\",\"description\":\"\",\"category\":\"visita\",\"priority\":\"urgent\",\"assigned_to\":6,\"due_date\":\"2025-08-29T06:00:00.000Z\",\"estimated_hours\":2,\"tags\":[]},\"created_at\":\"2025-08-27T22:03:21.982Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"in_progress\"},\"created_at\":\"2025-08-27T22:04:24.793Z\"}],\"team_code\":\"GWG8XN\",\"assigned_by_name\":\"Nicolas Siguero\",\"assigned_to_name\":\"Rodrigo Quesada\"},\"new_value\":{\"status\":\"completed\"},\"created_at\":\"2025-08-27T22:04:46.015Z\"}]', 'GWG8XN', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `total_carrefour`
--

CREATE TABLE `total_carrefour` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_compras` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cadena` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razon_social` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rotulo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `municipio` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `com_autonoma` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `snacks` decimal(10,3) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `total_carrefour`
--

INSERT INTO `total_carrefour` (`id`, `codigo`, `c_compras`, `cadena`, `razon_social`, `rotulo`, `direccion`, `numero`, `municipio`, `provincia`, `com_autonoma`, `postal`, `snacks`, `created_at`, `updated_at`) VALUES
(1, '002800428', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'N-I KM', '14,5', 'ALCOBENDAS', 'MADRID', 'MADRID', '28100', '145.688', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(2, '000803492', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'NACIONAL II', '644', 'CABRERA DE MAR', 'BARCELONA', 'CATALUÑA', '08349', '124.632', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(3, '002812013', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'GRAN VIA DE HORTALEZA', 'S/N', 'MADRID', 'MADRID', 'MADRID', '28043', '124.500', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(4, '002806994', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'GUADALAJARA', '   2', 'MADRID', 'MADRID', 'MADRID', '28032', '113.311', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(5, '002802195', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'DE LA MORERAS', '2', 'MAJADAHONDA', 'MADRID', 'MADRID', '28220', '113.137', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(6, '000700833', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'GENERAL RIERA', '152', 'PALMA', 'BALEARS (ILLES)', 'BALEARES', '07010', '111.376', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(7, '000806248', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'A-18                 KM', '17,8', 'TERRASSA', 'BARCELONA', 'CATALUÑA', '08223', '102.378', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(8, '002811069', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'ANDALUCIA', 'K7,1', 'MADRID', 'MADRID', 'MADRID', '28041', '101.162', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(9, '000808807', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'COMUNIDAD EUROPEA', 'S/N', 'BADALONA', 'BARCELONA', 'CATALUÑA', '08917', '100.887', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(10, '000301346', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'VALENCIA', 'KM89', 'SANT JOAN D ALACANT', 'ALICANTE/ALACANT', 'COMUNIDAD VALENCIANA', '03550', '98.378', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(11, '000400079', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'MEDITERRANEO', '244', 'ALMERÍA', 'ALMERÍA', 'ANDALUCIA ORIENTAL', '04006', '98.378', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(12, '000700799', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'CARDENAL ROSELL', ' S/N', 'PALMA', 'BALEARS (ILLES)', 'BALEARES', '07007', '96.638', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(13, '004803341', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'IBARZAHARRA', 'S/N', 'SESTAO', 'BIZKAIA', 'PAIS VASCO', '48910', '93.950', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(14, '004700130', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'MONASTERIO N.SRA.PRADO', '5', 'VALLADOLID', 'VALLADOLID', 'CASTILLA Y LEON', '47014', '91.684', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(15, '000302005', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'FINESTRAT-CALA', 'KM 5', 'FINESTRAT', 'ALICANTE/ALACANT', 'COMUNIDAD VALENCIANA', '03509', '88.452', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(16, '002808288', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'MADRID-LA CORUÑA', 'KM22', 'ROZAS DE MADRID (LAS)', 'MADRID', 'MADRID', '28230', '88.408', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(17, '001102434', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'DE EUROPA', 'S/N', 'JEREZ DE LA FRONTERA', 'CÁDIZ', 'ANDALUCIA OCCIDENTAL', '11405', '88.010', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(18, '003700748', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'AGUSTINOS RECOLETOS', '1-35', 'SALAMANCA', 'SALAMANCA', 'CASTILLA Y LEON', '37005', '87.839', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(19, '000808442', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'ALVAR AALTO', 'S/N', 'MANRESA', 'BARCELONA', 'CATALUÑA', '08243', '87.788', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(20, '002812692', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'POBLADOS', '58', 'MADRID', 'MADRID', 'MADRID', '28044', '87.685', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(21, '001800812', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'ARMILLA', ' S/N', 'GRANADA', 'GRANADA', 'ANDALUCIA ORIENTAL', '18006', '87.143', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(22, '000800342', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'BARCELONA', 'K6,7', 'BARBERÀ DEL VALLÈS', 'BARCELONA', 'CATALUÑA', '08210', '87.131', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(23, '005001874', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'MARIA ZAMBRANO', '71', 'ZARAGOZA', 'ZARAGOZA', 'ARAGON', '50018', '87.107', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(24, '004300492', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'DE REUS', 'KM 4', 'TARRAGONA', 'TARRAGONA', 'CATALUÑA', '43080', '86.724', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(25, '004100412', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'JOSE JESUS GARICA DIAZ', '1', 'SEVILLA', 'SEVILLA', 'ANDALUCIA OCCIDENTAL', '41020', '86.184', '2025-09-05 08:47:02', '2025-09-05 08:47:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `total_mercado`
--

CREATE TABLE `total_mercado` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_compras` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cadena` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razon_social` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rotulo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `municipio` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `com_autonoma` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cereales` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `snacks` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `total_mercado`
--

INSERT INTO `total_mercado` (`id`, `codigo`, `c_compras`, `cadena`, `razon_social`, `rotulo`, `direccion`, `numero`, `municipio`, `provincia`, `com_autonoma`, `postal`, `cereales`, `snacks`, `area`, `created_at`, `updated_at`) VALUES
(1, '002804763', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'MONFORTE DE LEMOS', '36', 'MADRID', 'MADRID', 'MADRID', '28029', '210.285', '169.163', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(2, '002800428', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'N-I KM', '14,5', 'ALCOBENDAS', 'MADRID', 'MADRID', '28100', '178.88', '145.688', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(3, '002812013', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'GRAN VIA DE HORTALEZA', 'S/N', 'MADRID', 'MADRID', 'MADRID', '28043', '152.865', '124.5', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(4, '002803023', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'VINATEROS', ' S/N', 'MADRID', 'MADRID', 'MADRID', '28030', '149.501', '120.266', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(5, '002806994', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'GUADALAJARA', '   2', 'MADRID', 'MADRID', 'MADRID', '28032', '139.126', '113.311', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(6, '002802195', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'DE LA MORERAS', '2', 'MAJADAHONDA', 'MADRID', 'MADRID', '28220', '138.912', '113.137', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(7, '004803341', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'IBARZAHARRA', 'S/N', 'SESTAO', 'BIZKAIA', 'PAIS VASCO', '48910', '138.69', '93.95', 'CENTRO-NORTE', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(8, '000702047', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'INCA               KM', ' 3.9', 'MARRATXÍ', 'BALEARS (ILLES)', 'BALEARES', '07141', '137.751', '128.231', 'MEDITERRANEO', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(9, '000803492', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'NACIONAL II', '644', 'CABRERA DE MAR', 'BARCELONA', 'CATALUÑA', '08349', '134.94', '124.632', 'MEDITERRANEO', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(10, '000807880', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'A 18', ' S/N', 'SANT QUIRZE DEL VALLÈS', 'BARCELONA', 'CATALUÑA', '08192', '127.87', '116.457', 'MEDITERRANEO', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(11, '000812909', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'MARINA', ' S/N', 'SANT BOI DE LLOBREGAT', 'BARCELONA', 'CATALUÑA', '08830', '124.821', '113.681', 'MEDITERRANEO', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(12, '002811069', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'ANDALUCIA', 'K7,1', 'MADRID', 'MADRID', 'MADRID', '28041', '124.209', '101.162', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(13, '004802208', 'GRUPO EROSKI', 'GRUPO EROSKI', 'GRUPO EROSKI', 'EROSKI', 'ZABALANDI', 'S/N', 'BASAURI', 'BIZKAIA', 'PAIS VASCO', '48970', '123.358', '88.411', 'CENTRO-NORTE', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(14, '002802131', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'PIO XII', '   2', 'MADRID', 'MADRID', 'MADRID', '28016', '122.482', '98.53', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(15, '004801977', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'LATAONDO BIDEA', '2', 'ERANDIO', 'BIZKAIA', 'PAIS VASCO', '48950', '119.017', '80.624', 'CENTRO-NORTE', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(16, '002000881', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'DE VENTAS', '  80', 'IRUN', 'GIPUZKOA', 'PAIS VASCO', '20305', '118.602', '79.625', 'CENTRO-NORTE', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(17, '000700833', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'GENERAL RIERA', '152', 'PALMA', 'BALEARS (ILLES)', 'BALEARES', '07010', '118.171', '111.376', 'MEDITERRANEO', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(18, '003900292', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'EL EMPALME-PENACASTILL', 'S/N', 'SANTANDER', 'CANTABRIA', 'CANTABRIA', '39011', '113.528', '76.906', 'CENTRO-NORTE', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(19, '004802155', 'GRUPO EROSKI', 'GRUPO EROSKI', 'GRUPO EROSKI', 'EROSKI', 'PERURI', 'S/N', 'LEIOA', 'BIZKAIA', 'PAIS VASCO', '48940', '112.983', '80.975', 'CENTRO-NORTE', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(20, '000806248', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'A-18                 KM', '17,8', 'TERRASSA', 'BARCELONA', 'CATALUÑA', '08223', '110.846', '102.378', 'MEDITERRANEO', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(21, '000808807', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR', 'CARREFOUR', 'COMUNIDAD EUROPEA', 'S/N', 'BADALONA', 'BARCELONA', 'CATALUÑA', '08917', '109.232', '100.887', 'MEDITERRANEO', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(22, '002808288', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'MADRID-LA CORUÑA', 'KM22', 'ROZAS DE MADRID (LAS)', 'MADRID', 'MADRID', '28230', '108.55', '88.408', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(23, '002000480', 'INDEPENDIENTE', 'GRUPO CARREFOUR', 'CARREFOUR PLANET', 'CARREFOUR PLAN', 'MADRID-IRUN  KM', '469', 'OIARTZUN', 'GIPUZKOA', 'PAIS VASCO', '20180', '107.939', '73.12', 'CENTRO-NORTE', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(24, '002812754', 'INDEPENDIENTE', 'EL CORTE INGLES/HIPERCOR', 'HIPERCOR', 'HIPERCOR', 'NACIONAL VI          KM', '12,5', 'POZUELO DE ALARCÓN', 'MADRID', 'MADRID', '28224', '107.733', '90.038', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02'),
(25, '002804772', 'INDEPENDIENTE', 'GRUPO AUCHAN', 'ALCAMPO', 'ALCAMPO', 'MONLEON ALBUFERA', ' S/N', 'MADRID', 'MADRID', 'MADRID', '28038', '107.717', '86.652', 'CENTRO-SUR', '2025-09-05 08:47:02', '2025-09-05 08:47:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `role` enum('admin','manager','field_agent') DEFAULT 'field_agent',
  `avatar_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `team_code` varchar(10) DEFAULT NULL,
  `team_name` varchar(255) DEFAULT NULL,
  `is_team_manager` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `avatar_url`, `is_active`, `last_login`, `created_at`, `updated_at`, `team_code`, `team_name`, `is_team_manager`) VALUES
(3, 'admin', 'admin@retailanalytics.com', '$2b$12$n7xNzNwj0TzLBzm0s7hLZuu.CNJrxGBOoMIX4aFkBu4vNg7YV135K', 'Admin', 'User', 'admin', NULL, 1, '2025-08-14 19:27:41', '2025-08-04 19:07:15', '2025-08-14 19:27:41', 'DEFAULT', 'Default Team', 1),
(4, 'john.doe', 'john.doe@retailanalytics.com', '$2b$12$FhmOM7VusQ2NF66Vs2Vf8uj3TivRgGDIOjqY8SYe0oiasJMYwPlXW', 'John', 'Doe', 'field_agent', NULL, 1, '2025-08-04 21:06:28', '2025-08-04 19:07:15', '2025-08-04 21:08:16', 'DEFAULT', 'Default Team', 0),
(5, 'nsiguero', 'nico.siguero@gmail.com', '$2b$12$nYXg5.WSmcxyKNc0DxqSyeuTGB8YN4OMIJsFtN6u8OMCIHJiRP0vO', 'Nicolas', 'Siguero', 'manager', NULL, 1, '2025-09-02 20:35:24', '2025-08-04 21:02:43', '2025-09-02 20:35:24', 'GWG8XN', 'T&Tech', 1),
(6, 'rquesada', 'rodrigo@gmail.com', '$2b$12$NoHBqr.QxERNzD715A2kdeU03BT7.YEQvhK.ysTT.MRUXpJ6wugSC', 'Rodrigo', 'Quesada', 'field_agent', NULL, 1, '2025-08-27 22:03:55', '2025-08-04 21:09:09', '2025-08-27 22:03:55', 'GWG8XN', 'T&Tech', 0),
(7, 'hburguillos', 'hector@gmail.com', '$2b$12$SkAM.ZzTKkoEa/vopMU2Ae9JDR3cQNm22HIuNwo341kL2Iiv8t4K2', 'Hector', 'Burguillos', 'field_agent', NULL, 1, NULL, '2025-08-07 18:31:07', '2025-08-07 18:31:07', 'GWG8XN', 'T&Tech', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `session_token`, `expires_at`, `ip_address`, `user_agent`, `is_active`, `created_at`) VALUES
(1, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNDQ5MCwiZXhwIjoxNzU0OTM5MjkwfQ.CWytixw42MD4FQ4XVxCYMAqJ4RKsvreAfL5i7JHMc3c', '2025-08-11 19:08:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 19:08:10'),
(2, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNDUwNCwiZXhwIjoxNzU0OTM5MzA0fQ.yx0UK5OSl60861OKl-Szmkq1gUODLKdL2b_HrIvWgVg', '2025-08-11 19:08:24', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 19:08:24'),
(3, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNDUyMywiZXhwIjoxNzU0OTM5MzIzfQ.iJCJ7I-8L7ANAv2nNEROyanZtWt2NW6g3qQJoCCtRZA', '2025-08-11 19:08:43', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 19:08:43'),
(4, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNDUyNywiZXhwIjoxNzU0OTM5MzI3fQ.2CTwsnctOzt21d-He_81nc-u0GylwDZObFwBCoMtXKA', '2025-08-11 19:08:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 19:08:47'),
(5, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNDY4MiwiZXhwIjoxNzU0OTM5NDgyfQ.42cc-JQN_elz0X6dismyaSswOaC04Hk_2KD8tQpVrSQ', '2025-08-11 19:11:22', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 19:11:22'),
(6, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNDY4NywiZXhwIjoxNzU0OTM5NDg3fQ.LxV013WWEhbOUVx7xC3sQi_66qGYiUe7N9oln2SAIeM', '2025-08-04 19:12:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 0, '2025-08-04 19:11:27'),
(7, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNDczMSwiZXhwIjoxNzU0OTM5NTMxfQ.iz8TA3hfaA-C6aYps4VpdpHYa-6sSpPCKY-Gqch6nWM', '2025-08-04 19:12:49', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 0, '2025-08-04 19:12:11'),
(8, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDMzNDg0NiwiZXhwIjoxNzU0OTM5NjQ2fQ.OAwk2Ppq5slZ1QDP6AAmHVODI3i4L6DBNcQTnLb6mZA', '2025-08-04 19:18:45', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 0, '2025-08-04 19:14:06'),
(9, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDMzNTEyOSwiZXhwIjoxNzU0OTM5OTI5fQ.8xQNp46KusHjUm_JYvAquXit-DjXV7KjbxqOhQawa7g', '2025-08-04 19:21:45', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 0, '2025-08-04 19:18:49'),
(10, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNTMxMCwiZXhwIjoxNzU0OTQwMTEwfQ.twBSBmnfQnTQeui9zCepEeuSUE0V5IDLXUalbl34Ne4', '2025-08-04 19:21:53', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 0, '2025-08-04 19:21:50'),
(11, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNTMxOCwiZXhwIjoxNzU0OTQwMTE4fQ.Bjs5vPbYyuftJg3FyYWfb_MveOGYsid6UbqnATgwykU', '2025-08-04 19:38:28', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 0, '2025-08-04 19:21:58'),
(12, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNzE0MCwiZXhwIjoxNzU0OTQxOTQwfQ.lnaXuucQ3NpfT1Po_GcJtxmK5rF4xIY2KoPvlnUOOrk', '2025-08-11 19:52:20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 19:52:20'),
(13, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDMzNzg0NSwiZXhwIjoxNzU0OTQyNjQ1fQ.y394CAL2sqJoIh_9k4e0DLeTxTJ7Sdw-bBMqHe0BfIE', '2025-08-11 20:04:05', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:04:05'),
(14, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzNzg1NCwiZXhwIjoxNzU0OTQyNjU0fQ._lEwcSvI1YZIaB6fRDcbH8IiSGOoQgVvCyBwwC9Vzvc', '2025-08-11 20:04:14', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:04:14'),
(15, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDMzNzg2MywiZXhwIjoxNzU0OTQyNjYzfQ.r1fAR3FZqJ3ofWruQDQa9H7anwN5_OeeMLSN7dxnUd8', '2025-08-11 20:04:23', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:04:23'),
(16, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzODc1MCwiZXhwIjoxNzU0OTQzNTUwfQ.MHiDIZyuZZ1c_iI6dn51V4d2k2mrgX303KJM2vLLYK8', '2025-08-11 20:19:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:19:10'),
(17, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDMzODc2MCwiZXhwIjoxNzU0OTQzNTYwfQ.aU4Rxt8-xCKva1-N2wXMbW1_x4L7EZJGN15ZMJ1hDTA', '2025-08-11 20:19:20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:19:20'),
(18, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzODk3MywiZXhwIjoxNzU0OTQzNzczfQ.HGAxVZbOgkhj0btKwtRofAjF93bER2Bh9KBJaMYDcUc', '2025-08-11 20:22:53', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:22:53'),
(19, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDMzOTI5NCwiZXhwIjoxNzU0OTQ0MDk0fQ.vAB22oESjCjMYXqkmDmTJXz_iwqBhJna7Mib5XATrTs', '2025-08-11 20:28:14', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:28:14'),
(20, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDMzOTk3OSwiZXhwIjoxNzU0OTQ0Nzc5fQ.EotPxrMgwAKwZTlYnMd-Sxi9Niq8k-8pkUVpvB5q30M', '2025-08-11 20:39:39', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:39:39'),
(21, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDM0MDEyMiwiZXhwIjoxNzU0OTQ0OTIyfQ.ixaVdkM4E2uhO7ShjtBuh44BHiOYMSSlDTeQTb-bI3U', '2025-08-11 20:42:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 20:42:02'),
(22, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDM0MTM2MywiZXhwIjoxNzU0OTQ2MTYzfQ.AU-aV1aDZkvXHFb4y2HwsVetR0aaL0KgV-ggXlC10Gg', '2025-08-11 21:02:43', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:02:43'),
(23, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDM0MTM3OSwiZXhwIjoxNzU0OTQ2MTc5fQ.SHYjEq8PUyQE1v7PZeI1H54D172ZjpNXyhsJuDGKRhY', '2025-08-11 21:02:59', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:02:59'),
(24, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQxNDIxLCJleHAiOjE3NTQ5NDYyMjF9.xTVn6fzNdGUBOoUMBLJHLR-v496useEYtWqu3kVrBDk', '2025-08-11 21:03:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:03:41'),
(25, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDM0MTUzNiwiZXhwIjoxNzU0OTQ2MzM2fQ.DrzYoHki0UWWck7hvPIStJRi6deRq-URzfASg93q-Ko', '2025-08-11 21:05:36', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:05:36'),
(26, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJqb2huLmRvZSIsImVtYWlsIjoiam9obi5kb2VAcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDM0MTU4OCwiZXhwIjoxNzU0OTQ2Mzg4fQ.ecFYZ7bXLyYtzJ-_OZJgdtO26IaIk3Uu_gEKS6HDUt4', '2025-08-11 21:06:28', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:06:28'),
(27, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQxNTk1LCJleHAiOjE3NTQ5NDYzOTV9.Ki_Z5m6Df9pYwHDMTjttTw0f5v_9cbHsdDbikC5vGWo', '2025-08-11 21:06:35', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:06:35'),
(28, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQzNDE3NDksImV4cCI6MTc1NDk0NjU0OX0.M-AWyd9Pd1kyrg_W4hAkA91eRZAf2_JSx_pb2C_hhDY', '2025-08-11 21:09:09', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:09:09'),
(29, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQzNDE3NjcsImV4cCI6MTc1NDk0NjU2N30.MX13VK9G1x3XrQtr3MhZPBkXGY-2tfpTniByeTuRT7c', '2025-08-11 21:09:27', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:09:27'),
(30, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQxNzgwLCJleHAiOjE3NTQ5NDY1ODB9.Ap7W5FPnr84BcGSgv6eOX1Gv5LcaHOUZc8kXSE2F2es', '2025-08-11 21:09:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:09:40'),
(31, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQxOTIzLCJleHAiOjE3NTQ5NDY3MjN9.A4RONl8K0LFqpapc1836DsrPVKV-7xwmgjhWxLvhbEU', '2025-08-11 21:12:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:12:03'),
(32, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQyMzI0LCJleHAiOjE3NTQ5NDcxMjR9.pGXi2gYPE8JhnNZ10aUQ6i4AWCBIs0wJdsgAR7UZLoM', '2025-08-11 21:18:44', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:18:44'),
(33, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQzNDMxNzEsImV4cCI6MTc1NDk0Nzk3MX0.s_Ne--OF7xY5IL96zvmmnUnej9BGtji-PfIH9ZZVF3k', '2025-08-11 21:32:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:32:51'),
(34, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQzMTc5LCJleHAiOjE3NTQ5NDc5Nzl9.8-xUbr8WTP-G0sndp6_jH90PybD79xAvJuhjGpId2as', '2025-08-11 21:32:59', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:32:59'),
(35, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQzNDMyMDMsImV4cCI6MTc1NDk0ODAwM30.y9sPahO4T3S0pTCCcPjYVkRdfVeuJzVBwasbHi9Ec0M', '2025-08-11 21:33:23', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:33:23'),
(36, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQzMzEyLCJleHAiOjE3NTQ5NDgxMTJ9.m3pekXXVfXmJobr4vPaehqlVXAaxD8WgXdYzb005iJ0', '2025-08-11 21:35:12', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:35:12'),
(37, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQzNDMzNDQsImV4cCI6MTc1NDk0ODE0NH0.6z2LOpImauFYHEofBdh0VHX64pKp2IIHxEq_9uyR6Ks', '2025-08-11 21:35:44', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:35:44'),
(38, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0MzQzNTE0LCJleHAiOjE3NTQ5NDgzMTR9._tCVb5TrJS23mIB2Porw4Nksiq7zMPd_4kOY7pd3bGs', '2025-08-11 21:38:34', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:38:34'),
(39, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQzNDM1NDAsImV4cCI6MTc1NDk0ODM0MH0.zseuru6G1xXiLFpjEg2uUxCTC2nE9Ce8sE_GrGPUz8E', '2025-08-11 21:39:00', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-04 21:39:00'),
(40, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0NTA2NTU0LCJleHAiOjE3NTUxMTEzNTR9.D3PAWQvXKEC5xJ8RXCsCpWa-nLss4KxmgMpuyQXRq9Y', '2025-08-13 18:55:54', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-06 18:55:54'),
(41, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQ1MDY4MTYsImV4cCI6MTc1NTExMTYxNn0.FkZYU99Xzkhscy04GsApsXR4TAK45SWwMACOLe0YXCc', '2025-08-13 19:00:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-06 19:00:16'),
(42, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTQ1OTE0MTEsImV4cCI6MTc1NTE5NjIxMX0.XJaaG60AB8jAvgDwS0AuQ0XvAGZCwOe3zm_LmeYukTw', '2025-08-14 18:30:11', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-07 18:30:11'),
(43, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJoYnVyZ3VpbGxvcyIsImVtYWlsIjoiaGVjdG9yQGdtYWlsLmNvbSIsInJvbGUiOiJmaWVsZF9hZ2VudCIsImlhdCI6MTc1NDU5MTQ2NywiZXhwIjoxNzU1MTk2MjY3fQ.IkIWQLCQUDatkPGdkPahFkaskwb66JytcI-SHA4z5kE', '2025-08-14 18:31:07', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-07 18:31:07'),
(44, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU0NTkxNDc5LCJleHAiOjE3NTUxOTYyNzl9.d3gsqGERAfzdDaJHYRsA0cvY4Cj53EAbqfW2hpI1pY0', '2025-08-14 18:31:19', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-07 18:31:19'),
(45, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcmV0YWlsYW5hbHl0aWNzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NTE5OTY2MSwiZXhwIjoxNzU1ODA0NDYxfQ.6IWNUoO5mJaeHVd772BYGUsfqAW05_3_0I1U1kT3JOI', '2025-08-21 19:27:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-14 19:27:41'),
(46, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU1MTk5NjcxLCJleHAiOjE3NTU4MDQ0NzF9.VUBYj4Ant7lBwY7Zms1aE4XyWD4RzwZVs4x_2x1KKpg', '2025-08-21 19:27:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-14 19:27:51'),
(47, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU1MjAzODAyLCJleHAiOjE3NTU4MDg2MDJ9.cYYP_AAqkC5l-93bxGhajA5uFdnd4gXdJJDWzNVQRIk', '2025-08-21 20:36:42', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0', 1, '2025-08-14 20:36:42'),
(48, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU1MjA0NTU3LCJleHAiOjE3NTU4MDkzNTd9.bXbxg3-Uy7PaBQ1YNco3jpJdQcbmYjgxGM6CT2Lj0MQ', '2025-08-21 20:49:17', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-14 20:49:17'),
(49, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTUyOTMzNzYsImV4cCI6MTc1NTg5ODE3Nn0.xbrqC_Q-F0sdyfjKGM34GmBhTojFGx5fkI6RQWfKZzM', '2025-08-22 21:29:36', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, '2025-08-15 21:29:36'),
(50, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTYzMjIwOTEsImV4cCI6MTc1NjkyNjg5MX0.MWMtRs5WvQqKP7wXq3FIWzq8MStqZJ5zkkvYSTbljIw', '2025-09-03 19:14:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 19:14:51'),
(51, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU2MzIzMjk3LCJleHAiOjE3NTY5MjgwOTd9.j_D3zX4ePGK_8KRJXJK5z34e88tf8ks2KEzXECw-CDI', '2025-09-03 19:34:57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 19:34:57'),
(52, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTYzMjM0OTMsImV4cCI6MTc1NjkyODI5M30.pBvq-vUteXKZW9oiZUAxP_dxJpx6QcckHw1XvKCexTA', '2025-09-03 19:38:13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 19:38:13'),
(53, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU2MzI0MDYwLCJleHAiOjE3NTY5Mjg4NjB9.AoqWqM0kAS56b8Zp2E4Qel-PGGACIvu7uQVsNYjSbJc', '2025-09-03 19:47:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 19:47:40'),
(54, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU2MzI5ODg2LCJleHAiOjE3NTY5MzQ2ODZ9.OjgyRBsv6lrO8gyDHK39eZBqSOofSM5GCr7Gvhe_JeU', '2025-09-03 21:24:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 21:24:46'),
(55, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU2MzMyMTE4LCJleHAiOjE3NTY5MzY5MTh9.KG9fXIPYyewLNq9JDife4_KFZAgz2O_n3_3C4LB2GSA', '2025-09-03 22:01:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 22:01:58'),
(56, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJycXVlc2FkYSIsImVtYWlsIjoicm9kcmlnb0BnbWFpbC5jb20iLCJyb2xlIjoiZmllbGRfYWdlbnQiLCJpYXQiOjE3NTYzMzIyMzUsImV4cCI6MTc1NjkzNzAzNX0.CcIRXcRxWkJLBlaiKd-5xuRsYc2Hls0UbSltOjsOzHQ', '2025-09-03 22:03:55', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 22:03:55'),
(57, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU2MzMyNjU3LCJleHAiOjE3NTY5Mzc0NTd9.i3THa15z7doCuiNETL-ArRs99Vn0op3zRwAdFMQxwvs', '2025-09-03 22:10:57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-08-27 22:10:57'),
(58, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJuc2lndWVybyIsImVtYWlsIjoibmljby5zaWd1ZXJvQGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwiaWF0IjoxNzU2ODQ1MzI0LCJleHAiOjE3NTc0NTAxMjR9.9LbMamPTcmOe3qDVApLG0_QaLsfUc2uexSoIEgw0KXc', '2025-09-09 20:35:24', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 1, '2025-09-02 20:35:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_uploads`
--

CREATE TABLE `user_uploads` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `size` int(11) NOT NULL,
  `original_size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user_uploads`
--

INSERT INTO `user_uploads` (`id`, `user_id`, `filename`, `url`, `uploaded_at`, `size`, `original_size`) VALUES
(53, 5, '1755284237839_7t6jkiq3hkc_46932c24-a23e-4871-9292-de42e3b54848.jpg', '/uploads/1755284237839_7t6jkiq3hkc_46932c24-a23e-4871-9292-de42e3b54848.jpg', '2025-08-15 18:57:17', 2850040, 2850040),
(54, 6, '1755590173705_ibdl5v62dx_46932c24-a23e-4871-9292-de42e3b54848.jpg', '/uploads/1755590173705_ibdl5v62dx_46932c24-a23e-4871-9292-de42e3b54848.jpg', '2025-08-19 07:56:13', 2850040, 2850040),
(55, 6, '1756324118733_5ap2n4wcvbo_46932c24-a23e-4871-9292-de42e3b54848.jpg', '/uploads/1756324118733_5ap2n4wcvbo_46932c24-a23e-4871-9292-de42e3b54848.jpg', '2025-08-27 19:48:38', 2850040, 2850040),
(56, 6, '1756324850496_z0r22gslrsl_conservas-vegetales-mercadona-2010591.webp', '/uploads/1756324850496_z0r22gslrsl_conservas-vegetales-mercadona-2010591.webp', '2025-08-27 20:00:50', 948100, 948100),
(57, 6, '1756332284809_gc3alewxi8j_conservas-vegetales-mercadona-2010591.webp', '/uploads/1756332284809_gc3alewxi8j_conservas-vegetales-mercadona-2010591.webp', '2025-08-27 22:04:44', 948100, 948100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitas`
--

CREATE TABLE `visitas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `supermercado_id` int(11) DEFAULT NULL,
  `fecha_visita` date DEFAULT NULL,
  `hora_inicio` datetime DEFAULT NULL,
  `hora_fin` datetime DEFAULT NULL,
  `duracion_estimada` int(11) DEFAULT NULL,
  `estado` enum('programada','en_progreso','completada','retrasada') DEFAULT NULL,
  `prioridad` enum('low','medium','high') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos_detectados`
--
ALTER TABLE `productos_detectados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_foto_id` (`foto_id`),
  ADD KEY `idx_producto_id` (`producto_id`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_marca` (`marca`);

--
-- Indices de la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_assigned_to` (`assigned_to`),
  ADD KEY `idx_assigned_by` (`assigned_by`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_due_date` (`due_date`),
  ADD KEY `idx_priority` (`priority`),
  ADD KEY `idx_team_code` (`team_code`),
  ADD KEY `idx_tasks_team_status` (`team_code`,`status`),
  ADD KEY `idx_tasks_team_priority` (`team_code`,`priority`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_tasks_cadena` (`cadena_supermercado`),
  ADD KEY `idx_tasks_area` (`area`);

--
-- Indices de la tabla `total_carrefour`
--
ALTER TABLE `total_carrefour`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_codigo` (`codigo`),
  ADD KEY `idx_cadena` (`cadena`),
  ADD KEY `idx_municipio` (`municipio`),
  ADD KEY `idx_provincia` (`provincia`),
  ADD KEY `idx_postal` (`postal`);

--
-- Indices de la tabla `total_mercado`
--
ALTER TABLE `total_mercado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_codigo_mercado` (`codigo`),
  ADD KEY `idx_cadena_mercado` (`cadena`),
  ADD KEY `idx_municipio_mercado` (`municipio`),
  ADD KEY `idx_provincia_mercado` (`provincia`),
  ADD KEY `idx_area` (`area`),
  ADD KEY `idx_postal_mercado` (`postal`),
  ADD KEY `idx_mercado_cadena_area` (`cadena`,`area`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_team_code` (`team_code`),
  ADD KEY `idx_team_name` (`team_name`),
  ADD KEY `idx_users_team_role` (`team_code`,`role`);

--
-- Indices de la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `idx_session_token` (`session_token`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indices de la tabla `user_uploads`
--
ALTER TABLE `user_uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_uploaded_at` (`uploaded_at`);

--
-- Indices de la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supermercado_id` (`supermercado_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos_detectados`
--
ALTER TABLE `productos_detectados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=300;

--
-- AUTO_INCREMENT de la tabla `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `total_carrefour`
--
ALTER TABLE `total_carrefour`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `total_mercado`
--
ALTER TABLE `total_mercado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `user_uploads`
--
ALTER TABLE `user_uploads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `visitas`
--
ALTER TABLE `visitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos_detectados`
--
ALTER TABLE `productos_detectados`
  ADD CONSTRAINT `productos_detectados_ibfk_1` FOREIGN KEY (`foto_id`) REFERENCES `user_uploads` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD CONSTRAINT `visitas_ibfk_1` FOREIGN KEY (`supermercado_id`) REFERENCES `supermercados` (`id`),
  ADD CONSTRAINT `visitas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
