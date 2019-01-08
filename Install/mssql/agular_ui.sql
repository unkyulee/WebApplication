IF OBJECT_ID('dbo.angular_ui', 'U') IS NULL
BEGIN
    CREATE TABLE angular_ui (
        _id int IDENTITY(1,1) PRIMARY KEY,
        content nvarchar(max),
        _created DATETIME default CURRENT_TIMESTAMP,
        _updated DATETIME default CURRENT_TIMESTAMP
    );
END