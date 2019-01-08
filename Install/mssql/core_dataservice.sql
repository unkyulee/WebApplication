IF OBJECT_ID('dbo.core_dataservice', 'U') IS NULL
BEGIN
    CREATE TABLE core_dataservice (
        _id int IDENTITY(1,1) PRIMARY KEY,
        type NVARCHAR(255) NOT NULL,
        name NVARCHAR(255),
        description NVARCHAR(255),
        connectionString NVARCHAR(255) NOT NULL,
        db NVARCHAR(255) NOT NULL,
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_dataservice ON;

IF EXISTS(SELECT * FROM core_dataservice WHERE _id = 1) DELETE FROM core_dataservice WHERE _id = 1
INSERT INTO core_dataservice (_id, type, name, description, connectionString, db)
VALUES (1, 'SQL', 'Site Admin SQL Data Services', 'Site Admin SQL Data Services',
  'Server=.\SQLExpress; Database=web; Integrated Security=SSPI;MultipleActiveResultSets=True',
  'web');

SET IDENTITY_INSERT core_dataservice OFF;