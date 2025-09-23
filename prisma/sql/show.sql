-- Shows users privileges
SHOW GRANTS FOR 'nextjs-deploy-user'@'localhost';
-- or for server
SHOW GRANTS FOR 'nextjs-deploy-user'@'%';

-- Shows all tables for the database
SHOW TABLES FROM `nextjs-deploy-db`;

-- Shows all users
SELECT User FROM mysql.user;

-- Shows all databases
SHOW DATABASES;