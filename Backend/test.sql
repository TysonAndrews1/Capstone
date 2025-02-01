-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: employee_management
-- ------------------------------------------------------
-- Server version	9.1.0

-- Initial Setup and Configuration
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Allows root user to access the database
GRANT ALL PRIVILEGES ON employee_management.* TO 'root'@'localhost' WITH GRANT OPTION;

-- Applies the grant statement immediately
FLUSH PRIVILEGES;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS employee_management;

-- Select the database to use
USE employee_management;

--
-- Table structure for table `banquet_events`
--

-- Deletes banquet_events if it exists
DROP TABLE IF EXISTS `banquet_events`;


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates banquet_events table structure
CREATE TABLE `banquet_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(100) NOT NULL,
  `event_start_date` datetime NOT NULL,
  `event_end_date` datetime NOT NULL,
  `event_location` varchar(255) NOT NULL,
  `number_of_guests` int NOT NULL,
  `assigned_manager` varchar(100) DEFAULT NULL,
  `special_requirements` text,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banquet_events`
--

-- Locks the banquet_event table from other connections from modifying it during the insert operation
LOCK TABLES `banquet_events` WRITE;
/*!40000 ALTER TABLE `banquet_events` DISABLE KEYS */;

INSERT INTO `banquet_events` VALUES 
(1,'Wedding Reception','2024-12-15 18:00:00','2024-12-15 22:00:00','Banquet Hall A',150,'John Doe','Vegetarian meals for 20 guests'),
(2,'Corporate Seminar','2024-12-20 09:00:00','2024-12-20 17:00:00','Conference Room B',50,'Jane Smith','Projector and sound system required'),
(3,'Christmas Party','2023-12-20 09:00:00','2023-12-20 17:00:00','Banquet Hall C',250,'Jane Smith','Add Christmas decor in room'),
(4,'18th Birthday Party','2022-05-21 17:00:00','2022-05-21 21:00:00','Banquet Hall A&B',90,'John Doe',''),
(5,'Poker Tournament','2024-12-01 09:00:00','2024-12-20 09:00:00','Casino Room',300,'John Doe','Add coffee and water station in room');
/*!40000 ALTER TABLE `banquet_events` ENABLE KEYS */;

-- Unlocks the banquet_events table
UNLOCK TABLES;

--
-- Table structure for table `banquet_accounts`
--

-- Deletes banquet_events if it exists
DROP TABLE IF EXISTS `banquet_accounts`;
DROP TABLE IF EXISTS `banquet_employees`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates banquet_accounts table structure
CREATE TABLE `banquet_accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `employee_id` varchar(6) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `role` varchar(100) NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banquet_accounts`
--

-- Locks the banquet_accounts table from other connections from modifying it during the insert operation
LOCK TABLES `banquet_accounts` WRITE;
/*!40000 ALTER TABLE `banquet_accounts` DISABLE KEYS */;

INSERT INTO `banquet_accounts` VALUES
(1, 'Tony', 'Voong', '000001', 'tonyvoong@example.com', '123 Home Road SE', '403-123-4567', 'Manager', 'ACTIVE'),
(2, 'Peter', 'Parker', '000002', 'spiderman@example.com', '456 Web Drive NE', '587-111-2222', 'Employee', 'ACTIVE'),
(3, 'Tony', 'Stark', '000003', 'ironman@example.com', '789 Stark Tower NW', '403-333-4444', 'Employee', 'INACTIVE');
/*!40000 ALTER TABLE `banquet_accounts` ENABLE KEYS */;

-- Unlocks the banquet_accounts table
UNLOCK TABLES;

--
-- Table structure for table `employee_shifts`
--

-- Deletes employee_shifts if it exists
DROP TABLE IF EXISTS `employee_shifts`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates employee_shifts table structure with foreign key relationships
CREATE TABLE `employee_shifts` (
  `shift_id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL, -- Foreign key referencing banquet_accounts
  `event_id` int NOT NULL,   -- Foreign key referencing banquet_events
  `shift_start_date` datetime NOT NULL,
  `shift_end_date` datetime NOT NULL,
  `description` text,
  `swappable` ENUM('YES', 'NO') NOT NULL DEFAULT 'NO',
  PRIMARY KEY (`shift_id`),
  FOREIGN KEY (`account_id`) REFERENCES `banquet_accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `banquet_events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Locks the employee_shifts table from other connections from modifying it during the insert operation
LOCK TABLES `employee_shifts` WRITE;
/*!40000 ALTER TABLE `employee_shifts` DISABLE KEYS */;

INSERT INTO `employee_shifts` VALUES
(1, 2, 3, '2025-12-20 14:00:00', '2025-12-20 22:00:00', 'This is a christmas party for 250 people', 'YES'),
(2, 2, 2, '2025-12-20 09:00:00', '2025-12-20 17:00:00', 'This is a 300-person conference for Calgary Police Service', 'NO'),
(3, 1, NULL, '2025-01-10 07:00:00', '2025-01-10 15:00:00', 'Manager duties for the day', 'NO');
(4, 3, 4, '2025-12-23 14:00:00', '2025-12-23 22:00:00','This is an 18th birthday party', 'YES');

/*!40000 ALTER TABLE `employee_shifts` ENABLE KEYS */;

-- Unlocks the employee_shifts table
UNLOCK TABLES;

--
-- Table structure for table `employee_requests`
--

-- Deletes employee_requests if it exists
DROP TABLE IF EXISTS `employee_requests`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates employee_requests table structure with foreign key relationships
CREATE TABLE `employee_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL, -- Foreign key referencing banquet_employees
  `request_type` ENUM('Time Off', 'Sick Day', 'Availability Change') NOT NULL,
  `request_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_date` datetime,
  `end_date` datetime,
  `details` text,
  `status` ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`request_id`),
  FOREIGN KEY (`account_id`) REFERENCES `banquet_employees` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Locks the employee_requests table from other connections from modifying it during the insert operation
LOCK TABLES `employee_requests` WRITE;
/*!40000 ALTER TABLE `employee_requests` DISABLE KEYS */;

INSERT INTO `employee_requests` VALUES 
(1, 2, 'Time Off', '2025-01-01 09:00:00', '2025-01-15 09:00:00', '2025-01-20 17:00:00', 'Family vacation', 'PENDING'),
(2, 2, 'Sick Day', '2025-01-05 08:00:00', '2025-01-05 09:00:00', '2025-01-05 17:00:00', 'Fever and cold', 'APPROVED'),
(3, 2, 'Availability Change', '2025-01-10 12:00:00', NULL, NULL, 'Request to work weekends only', 'DECLINED');

/*!40000 ALTER TABLE `employee_requests` ENABLE KEYS */;

-- Unlocks the employee_requests table
UNLOCK TABLES;

--
-- Table structure for table `employee_availability`
--

-- Deletes employee_availability if it exists
DROP TABLE IF EXISTS `employee_availability`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates employee_availability table structure with foreign key relationships
CREATE TABLE `employee_availability` (
  `availability_id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL, -- Foreign key referencing banquet_accounts
  `day_of_week` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  `start_time` time,
  `end_time` time,
  PRIMARY KEY (`availability_id`),
  FOREIGN KEY (`account_id`) REFERENCES `banquet_accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Locks the employee_availability table from other connections from modifying it during the insert operation
LOCK TABLES `employee_availability` WRITE;
/*!40000 ALTER TABLE `employee_availability` DISABLE KEYS */;

INSERT INTO `employee_availability` VALUES 
(1, 2, 'Monday', '09:00:00', '17:00:00'),
(2, 2, 'Tuesday', '12:00:00', '20:00:00'),
(3, 2, 'Wednesday', '10:00:00', '20:00:00'),
(4, 2, 'Thursday', NULL, NULL),
(5, 2, 'Friday', '16:00:00', '24:00:00'),
(6, 2, 'Saturday', '16:00:00', '24:00:00'),
(7, 2, 'Sunday', NULL, NULL);

/*!40000 ALTER TABLE `employee_availability` ENABLE KEYS */;

-- Unlocks the employee_availability table
UNLOCK TABLES;

-- Cleanup and Reset Settings
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26 23:50:30
