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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
(3, 'Tony', 'Stark', '000003', 'ironman@example.com', '789 Stark Tower NW', '403-333-4444', 'Employee', 'INACTIVE'),
(4, 'Steve', 'Rogers', '000004', 'captianamerica@example.com', '1 Shield Ave SW', '403-111-1111', 'Employee', 'ACTIVE'),
(5, 'Natasha', 'Romanoff', '000005', 'blackwidow@example.com', '2 Spy Blvd SE', '403-222-2222', 'Employee', 'ACTIVE'),
(6, 'Clint', 'Barton', '000006', 'hawkeye@example.com', '3 Arrow Place NE', '403-333-3333', 'Employee', 'ACTIVE'),
(7, 'Bruce', 'Banner', '000007', 'hulk@example.com', '4 Smash Way SE', '403-444-4444', 'Employee', 'ACTIVE');
(0, 'System', 'Log', '000000', 'N/A', 'N/A', 'N/A', 'Manager', 'ACTIVE');
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
  `event_id` int,   -- Foreign key referencing banquet_events
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
(3, 1, NULL, '2025-01-10 07:00:00', '2025-01-10 15:00:00', 'Manager duties for the day', 'NO'),
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
  `account_id` int NOT NULL, -- Foreign key referencing banquet_accounts
  `request_type` ENUM('Time Off', 'Sick Day', 'Availability Change') NOT NULL,
  `request_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_date` datetime,
  `end_date` datetime,
  `details` text,
  `status` ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`request_id`),
  FOREIGN KEY (`account_id`) REFERENCES `banquet_accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Locks the employee_requests table from other connections from modifying it during the insert operation
LOCK TABLES `employee_requests` WRITE;
/*!40000 ALTER TABLE `employee_requests` DISABLE KEYS */;

INSERT INTO `employee_requests` VALUES 
(1, 2, 'Time Off', '2025-01-01 09:00:00', '2025-01-15 09:00:00', '2025-01-20 17:00:00', 'Family vacation', 'PENDING'),
(2, 2, 'Sick Day', '2025-01-05 08:00:00', '2025-01-05 09:00:00', '2025-01-05 17:00:00', 'Fever and cold', 'APPROVED'),
(3, 2, 'Availability Change', '2025-01-10 12:00:00', NULL, NULL, 'Request to work weekends only', 'DECLINED'),
(4, 4, 'Availability Change', '2025-02-09 08:00:00', NULL, NULL, 'Can work anytime and any day', 'APPROVED'),
(5, 4, 'Time Off', '2025-02-09 08:30:00', '2025-04-10 08:00:00', '2025-04-20 08:00:00', 'Need to study for finals', 'APPROVED'),
(6, 5, 'Sick Day', '2025-02-12 06:00:00', '2025-02-12 08:00:00', '2025-02-12 16:00:00', 'Woke up with a migraine', 'APPROVED'),
(7, 6, 'Sick Day', '2025-02-20 07:00:00', '2025-02-20 08:00:00', '2025-02-20 16:00:00', 'Got into a car accident', 'APPROVED'),
(8, 6, 'Time Off', '2025-02-21 10:00:00', '2025-03-01 08:00:00', '2025-03-02 23:00:00', 'Need to take my car to the auto body shop', 'PENDING'),
(9, 7, 'Time Off', '2025-01-29 10:30:00', '2025-05-01 08:00:00', '2025-05-31 23:00:00', 'Going to Europe for a month', 'APPROVED'),
(10, 7, 'Availability Change', '2025-03-02 10:00:00', NULL, NULL, 'Can only work weekends once school starts', 'PENDING'),
(11, 3, 'Availability Change', '2025-01-01 08:00:00', NULL, NULL, 'Going back to my full job, will be back for the christmas season', 'APPROVED'),
(12, 2, 'Time Off', '2024-10-11 09:00:00', '2024-12-01 09:00:00', '2024-12-20 17:00:00', 'Final Exams', 'APPROVED'),
(13, 2, 'Time Off', '2025-03-02 11:00:00', '2025-03-03 08:00:00', '2025-03-04 23:00:00', 'Sorry for short notice but my friends want to go snowboarding', 'DECLINED'),
(14, 2, 'Time Off', '2025-03-06 10:00:00', '2025-03-22 08:00:00', '2025-03-23 23:00:00', 'Snowboarding Trip', 'APPROVED'),
(15, 2, 'Time Off', '2025-03-12 08:00:00', '2025-04-15 08:00:00', '2025-04-20 23:00:00', 'Finals week! need to study', 'PENDING'),
(16, 6, 'Time Off', '2025-03-01 10:00:00', '2025-04-01 08:00:00', '2025-04-07 23:00:00', 'Wisdom tooth surgery and recovery', 'APPROVED'),
(17, 6, 'Time Off', '2025-02-03 09:00:00', '2025-02-05 08:00:00', '2025-02-05 23:00:00', 'Friends want to go to banff', 'DECLINED'),
(18, 6, 'Time Off', '2025-01-02 10:00:00', '2025-01-25 08:00:00', '2025-01-26 23:00:00', 'Booking off for my birthday', 'APPROVED'),
(19, 6, 'Time Off', '2025-03-02 10:00:00', '2025-03-03 08:15:00', '2025-03-04 23:00:00', 'Snowboarding trip with peter! Decline if its too short of a notice', 'DECLINED'),
(20, 6, 'Time Off', '2025-03-20 10:00:00', '2025-06-01 08:00:00', '2025-06-30 23:00:00', 'Found a summer job, might be gone in june', 'PENDING');

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
(5, 2, 'Friday', '16:00:00', '23:59:59'),
(6, 2, 'Saturday', '16:00:00', '23:59:59'),
(7, 2, 'Sunday', NULL, NULL);

/*!40000 ALTER TABLE `employee_availability` ENABLE KEYS */;

-- Unlocks the employee_availability table
UNLOCK TABLES;

--
-- Table structure for table `employee_vote`
--

-- Deletes employee_vote if it exists
DROP TABLE IF EXISTS `employee_vote`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates employee_vote table structure with foreign key relationships
CREATE TABLE `employee_vote` (
  `vote_id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL, -- Foreign key referencing banquet_accounts
  `nominee_id` int NOT NULL, -- Foreign key referencing banquet_accounts
  `vote_date` datetime NOT NULL,
  `reason` text NOT NULL,
  `vote_weight` DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  PRIMARY KEY (`vote_id`),
  FOREIGN KEY (`account_id`) REFERENCES `banquet_accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`nominee_id`) REFERENCES `banquet_accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Locks the employee_vote table from other connections from modifying it during the insert operation
LOCK TABLES `employee_vote` WRITE;
/*!40000 ALTER TABLE `employee_vote` DISABLE KEYS */;

INSERT INTO `employee_vote` VALUES 
(1, 1, 2, '2025-02-25 10:30:00', 'Always willing to help and stays late to assist the team.', 1.0),
(2, 4, 5, '2025-02-25 11:00:00', 'Great leadership skills and positive attitude.', 1.0),
(3, 5, 2, '2025-02-25 12:15:00', 'Goes above and beyond to ensure customer satisfaction.', 1.0),
(4, 6, 2, '2025-02-25 12:35:00', 'Teamplayer!', 1.0),
(5, 7, 2, '2025-02-25 12:55:00', 'Works really hard and helps others!', 1.0);
/*!40000 ALTER TABLE `employee_vote` ENABLE KEYS */;


-- Unlocks the employee_vote table
UNLOCK TABLES;
DROP TABLE IF EXISTS `banquet_chat_accounts`;
DROP TABLE IF EXISTS `banquet_chat_messages`;
DROP TABLE IF EXISTS `banquet_chat`;

CREATE TABLE banquet_chat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
CREATE TABLE banquet_chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chat_id BIGINT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES banquet_chat(id) ON DELETE CASCADE
);
CREATE TABLE banquet_chat_accounts (
    chat_id BIGINT NOT NULL,
    account_id INT NOT NULL,
    PRIMARY KEY (chat_id, account_id),
    FOREIGN KEY (chat_id) REFERENCES banquet_chat(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES banquet_accounts(account_id) ON DELETE CASCADE
);

INSERT INTO `banquet_chat` (id, name) VALUES (1, 'Public Chat');
DELETE FROM banquet_chat 
WHERE id NOT IN (SELECT DISTINCT chat_id FROM banquet_chat_accounts) 
AND id != 1;


--
-- Table structure for table `employee_attendance`
--

-- Deletes banquet_events if it exists
DROP TABLE IF EXISTS `employee_attendance`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates employee_attendance table structure
CREATE TABLE `employee_attendance` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `clock_in_time` DATETIME DEFAULT NULL,
  `clock_out_time` DATETIME DEFAULT NULL,
  `status` ENUM('CLOCKED_IN', 'CLOCKED_OUT') NOT NULL DEFAULT 'CLOCKED_OUT',
  FOREIGN KEY (`account_id`) REFERENCES `banquet_accounts`(`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_attendance`
--

-- Locks the employee_attendance table from other connections from modifying it during the insert operation
LOCK TABLES `employee_attendance` WRITE;
/*!40000 ALTER TABLE `employee_attendance` DISABLE KEYS */;

INSERT INTO `employee_attendance` VALUES
(1, 2, '2025-02-25 08:00:00', '2025-02-25 16:00:00', 'CLOCKED_OUT'),
(2, 2, '2025-02-27 09:00:00', '2025-02-27 17:00:00', 'CLOCKED_OUT');
/*!40000 ALTER TABLE `employee_attendance` ENABLE KEYS */;

-- Unlocks the employee_attendance table
UNLOCK TABLES;

--
-- Table structure for table `employee_winner`
--

-- Deletes employee_winner if it exists
DROP TABLE IF EXISTS `employee_winner`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
-- Creates employee_winner table structure
CREATE TABLE `employee_winner` (
  `winner_id` INT PRIMARY KEY AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  FOREIGN KEY (`account_id`) REFERENCES `banquet_accounts`(`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

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