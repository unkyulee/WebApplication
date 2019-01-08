IF OBJECT_ID('dbo.core_role_group', 'U') IS NULL
BEGIN
    CREATE TABLE core_role_group (
        _id int IDENTITY(1,1) PRIMARY KEY,
        role_id int,
        group_id int,
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_role_group ON;

IF EXISTS(SELECT * FROM core_role_group WHERE _id = 1) DELETE FROM core_role_group WHERE _id = 1
INSERT INTO core_role_group (_id, role_id, group_id)
VALUES (1, 1, 1);

SET IDENTITY_INSERT core_role_group OFF;
