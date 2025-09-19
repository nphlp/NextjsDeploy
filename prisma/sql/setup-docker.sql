-- Creates an user and a password
CREATE USER IF NOT EXISTS 'nextjs-deploy-user'@'%' IDENTIFIED BY 'nextjs-deploy-password';

-- Allows user to connect to database
GRANT ALL PRIVILEGES ON *.* TO 'nextjs-deploy-user'@'%';

-- Create the database
CREATE DATABASE IF NOT EXISTS `nextjs-deploy-db`;

-- Grant privileges to the user on the database
GRANT ALL PRIVILEGES ON `nextjs-deploy-db`.* TO 'nextjs-deploy-user'@'%';
