
IF OBJECT_ID('dbo.core_group', 'U') IS NULL
BEGIN
    CREATE TABLE core_group (
        _id int IDENTITY(1,1) PRIMARY KEY,
        navigation_id int NOT NULL,
        name NVARCHAR(255),
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_group ON;

IF EXISTS(SELECT * FROM core_group WHERE _id = 1) DELETE FROM core_group WHERE _id = 1
INSERT INTO core_group (_id, navigation_id, name)
VALUES (1, 2, 'Administrators');

SET IDENTITY_INSERT core_group OFF;