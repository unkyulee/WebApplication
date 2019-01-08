CREATE TABLE IF NOT EXISTS core_group_user (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id int,
    user_id int,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_group_user WHERE _id = 1;
INSERT INTO core_group_user (_id, group_id, user_id)
VALUES (1, 1, 1);
