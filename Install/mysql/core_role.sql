CREATE TABLE IF NOT EXISTS core_role (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6)NOT NULL,
    name VARCHAR(255),
    description VARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_role WHERE _id = 1;
INSERT INTO core_role (_id, navigation_id, name, description)
VALUES (1, 2, 'Administrators', 'Administrators');
