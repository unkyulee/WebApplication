CREATE TABLE IF NOT EXISTS core_dataservice (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type NVARCHAR(255) NOT NULL,
    name NVARCHAR(255),
    description NVARCHAR(255),
    connectionString NVARCHAR(255) NOT NULL,
    db NVARCHAR(255) NOT NULL,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_dataservice WHERE _id = 1;
INSERT INTO core_dataservice (_id, type, name, description, connectionString, db)
VALUES (1, 'SQL', 'Site Admin SQL Data Services', 'Site Admin SQL Data Services',
  '{
      "servername": "localhost",
      "username": "root",
      "password": "",
      "db": "web"
  }',
  'web');
