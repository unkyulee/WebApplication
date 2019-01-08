
IF OBJECT_ID('dbo.core_policy', 'U') IS NULL
BEGIN
    CREATE TABLE core_policy (
        _id int IDENTITY(1,1) PRIMARY KEY,
        role_id int NOT NULL,
        type bit,
        policy NVARCHAR(255),
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_policy ON;

IF EXISTS(SELECT * FROM core_policy WHERE _id = 1) DELETE FROM core_policy WHERE _id = 1
INSERT INTO core_policy (_id, role_id, type, policy)
VALUES (1, 1, 1, '*:*');

SET IDENTITY_INSERT core_policy OFF;