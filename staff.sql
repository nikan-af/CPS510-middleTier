CREATE TABLE Staff(
      UserID NUMBER REFERENCES Users (UserID) NOT NULL UNIQUE,
      Title VARCHAR2(100) NOT NULL,
      Department VARCHAR2(200) NOT NULL,
      ManagerID NUMBER REFERENCES Users (UserID) NOT NULL,
      PayRate NUMBER(4,2)
);