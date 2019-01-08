CREATE TABLE IF NOT EXISTS core_policy (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id INT(6)NOT NULL,
    type bit,
    policy VARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_policy WHERE _id = 1;
INSERT INTO core_policy (_id, role_id, type, policy)
VALUES (1, 1, 1, '*:*');
