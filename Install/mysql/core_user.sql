CREATE TABLE IF NOT EXISTS core_user (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6),
    id VARCHAR(255),
    password VARCHAR(1024),
    name VARCHAR(255),
    mobile VARCHAR(255),
    email VARCHAR(255),
    note VARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_user WHERE _id = 1;
INSERT INTO core_user (_id, navigation_id, id, name)
VALUES (1, 2, 'admin', 'Administrator');
