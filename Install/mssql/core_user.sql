IF OBJECT_ID('dbo.core_user', 'U') IS NULL
BEGIN
    CREATE TABLE core_user (
        _id int IDENTITY(1,1) PRIMARY KEY,
        navigation_id int NOT NULL,
        id NVARCHAR(255),
        password NVARCHAR(MAX),
        name NVARCHAR(255),
        mobile NVARCHAR(255),
        email NVARCHAR(255),
        note NVARCHAR(255),
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_user ON;

IF EXISTS(SELECT * FROM core_user WHERE _id = 1) DELETE FROM core_user WHERE _id = 1
INSERT INTO core_user (_id, navigation_id, id, name)
VALUES (1, 2, 'admin', 'Administrator');

SET IDENTITY_INSERT core_user OFF;
