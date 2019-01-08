CREATE TABLE IF NOT EXISTS core_group (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6)NOT NULL,
    name NVARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_group WHERE _id = 1;
INSERT INTO core_group (_id, navigation_id, name)
VALUES (1, 2, 'Administrators');
