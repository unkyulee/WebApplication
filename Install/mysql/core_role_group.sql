CREATE TABLE IF NOT EXISTS core_role_group (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id int,
    group_id int,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_role_group WHERE _id = 1;
INSERT INTO core_role_group (_id, role_id, group_id)
VALUES (1, 1, 1);

