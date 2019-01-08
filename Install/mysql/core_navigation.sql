CREATE TABLE IF NOT EXISTS core_navigation (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(255),
    description NVARCHAR(255),
    url NVARCHAR(255),
    priority INT(6) NOT NULL,
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

DELETE FROM core_navigation WHERE _id = 1;
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (1, 'Default Site', 'Default Site', '/', 1, 'angular');

DELETE FROM core_navigation WHERE _id = 2;
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (2, 'Admin', 'Provide site administration', '/admin', 2, 'angular');

DELETE FROM core_navigation WHERE _id = 3;
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (3, 'Admin Web Services', 'Provide site administration web services', '/adminapi', 3, 'websvc');

