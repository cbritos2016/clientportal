
USE BBClients;

-- Create the updated table with the new name
CREATE TABLE ClientPortal (
    id INT PRIMARY KEY IDENTITY(1,1),
    ClientID VARCHAR(5) NOT NULL,
    ClientName VARCHAR(95),
    PortalName VARCHAR(100),
    PortalServerName VARCHAR(300),
    PortalUserName VARCHAR(50),
    PortalPassword VARCHAR(255),
    Remark VARCHAR(4000),
    CreatedDateTime DATETIME DEFAULT GETDATE() NOT NULL,
    ModifiedDateTime DATETIME DEFAULT GETDATE() NOT NULL,
    IsActive BIT NOT NULL
);

-- Recreate the Users table in the new database (since it was in MyItemsDB)
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    createdDateTime DATETIME DEFAULT GETDATE()
);
