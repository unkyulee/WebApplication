IF OBJECT_ID('dbo.core_workflow', 'U') IS NULL
BEGIN
    CREATE TABLE core_workflow (
        _id int IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255),
        description NVARCHAR(255),
        script NVARCHAR(MAX),
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END

SET IDENTITY_INSERT core_workflow ON;

DELETE FROM core_workflow WHERE _id = 40
INSERT INTO core_workflow (_id, name) VALUES (40, 'SQL List');

DELETE FROM core_workflow WHERE _id = 60
INSERT INTO core_workflow (_id, name) VALUES (60, 'SQL Insert');

DELETE FROM core_workflow WHERE _id = 70
INSERT INTO core_workflow (_id, name) VALUES (70, 'SQL Update');

DELETE FROM core_workflow WHERE _id = 80
INSERT INTO core_workflow (_id, name) VALUES (80, 'SQL Delete');

DELETE FROM core_workflow WHERE _id = 90
INSERT INTO core_workflow (_id, name) VALUES (90, 'SQL Query');

DELETE FROM core_workflow WHERE _id = 100
INSERT INTO core_workflow (_id, name) VALUES (100, 'SQL Upload');

DELETE FROM core_workflow WHERE _id = 110
INSERT INTO core_workflow (_id, name) VALUES (110, 'SQL Download');

DELETE FROM core_workflow WHERE _id = 140
INSERT INTO core_workflow (_id, name) VALUES (140, 'User Upsert');

DELETE FROM core_workflow WHERE _id = 150
INSERT INTO core_workflow (_id, name) VALUES (150, 'User Change Password');

DELETE FROM core_workflow WHERE _id = 160
INSERT INTO core_workflow (_id, name) VALUES (160, 'File Upload');

DELETE FROM core_workflow WHERE _id = 170
INSERT INTO core_workflow (_id, name) VALUES (170, 'File Download');

DELETE FROM core_workflow WHERE _id = 180
INSERT INTO core_workflow (_id, name) VALUES (180, 'REST Request');

SET IDENTITY_INSERT core_workflow OFF;