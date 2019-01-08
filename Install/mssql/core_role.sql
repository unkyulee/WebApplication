IF OBJECT_ID('dbo.core_role', 'U') IS NULL
BEGIN
    CREATE TABLE core_role (
        _id int IDENTITY(1,1) PRIMARY KEY,
        navigation_id int NOT NULL,
        name NVARCHAR(255),
        description NVARCHAR(255),
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_role ON;

IF EXISTS(SELECT * FROM core_role WHERE _id = 1) DELETE FROM core_role WHERE _id = 1
INSERT INTO core_role (_id, navigation_id, name, description)
VALUES (1, 2, 'Administrators', 'Administrators');

SET IDENTITY_INSERT core_role OFF;