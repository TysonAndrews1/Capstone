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

-- Applies the grant statement immediatelty
FLUSH PRIVILEGES;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS employee_management;

-- Select the database to use
USE employee_management;

--
-- Table structure for table `banquet_events`
--

-- Delets banquet_events if it exists
DROP TABLE IF EXISTS `banquet_events`;


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates the banquet_events table
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

-- Unlocks the benquet_events table
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
