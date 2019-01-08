IF OBJECT_ID('dbo.core_group_user', 'U') IS NULL
BEGIN
    CREATE TABLE core_group_user (
        _id int IDENTITY(1,1) PRIMARY KEY,
        group_id int,
        user_id int,
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_group_user ON;

IF EXISTS(SELECT * FROM core_group_user WHERE _id = 1) DELETE FROM core_group_user WHERE _id = 1
INSERT INTO core_group_user (_id, group_id, user_id)
VALUES (1, 1, 1);

SET IDENTITY_INSERT core_group_user OFF;