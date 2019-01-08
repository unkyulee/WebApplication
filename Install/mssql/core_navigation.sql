IF OBJECT_ID('dbo.core_navigation', 'U') IS NULL
BEGIN
    CREATE TABLE core_navigation (
        _id int IDENTITY(1,1) PRIMARY KEY ,
        name NVARCHAR(255),
        description NVARCHAR(255),
        url NVARCHAR(255),
        priority int NOT NULL,
        module NVARCHAR(255),
        color_primary NVARCHAR(50),
        color_primaryLight NVARCHAR(50),
        color_primaryDark NVARCHAR(50),
        color_secondary NVARCHAR(50),
        color_secondaryLight NVARCHAR(50),
        color_secondaryDark NVARCHAR(50),
        color_accent NVARCHAR(50),
        color_accentLight NVARCHAR(50),
        color_accentDark NVARCHAR(50),
        color_background NVARCHAR(50),
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END


SET IDENTITY_INSERT core_navigation ON;

IF EXISTS(SELECT * FROM core_navigation WHERE _id = 1) DELETE FROM core_navigation WHERE _id = 1
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (1, 'Default Site', 'Default Site', '/', 1, 'Module.SinglePage.dll');

IF EXISTS(SELECT * FROM core_navigation WHERE _id = 2)  DELETE FROM core_navigation WHERE _id = 2
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (2, 'Admin', 'Provide site administration', '/admin', 2, 'Module.SinglePage.dll');

IF EXISTS(SELECT * FROM core_navigation WHERE _id = 3)  DELETE FROM core_navigation WHERE _id = 3
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (3, 'Admin Web Services', 'Provide site administration web services', '/adminapi', 3, 'Module.WebServices.dll');

SET IDENTITY_INSERT core_navigation OFF;