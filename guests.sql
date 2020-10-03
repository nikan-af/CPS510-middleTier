CREATE TABLE Guests(
      UserID NUMBER,
      FName VARCHAR(100) NOT NULL,
      LName VARCHAR(100) NOT NULL,
      Password VARCHAR(100) NOT NULL,
      Email VARCHAR(200) NOT NULL,
      Address VARCHAR(200) NOT NULL,
      Tel NUMBER,
      UserType VARCHAR(50) NOT NULL,
      LoyalCustomer CHAR(1),
      DiscountRate NUMBER(4,2),
      CreatedAt TIMESTAMP,
      UpdatedAt TIMESTAMP
);

DROP TABLE Guests;

ALTER TABLE Guests ADD (
    CONSTRAINT userID_pk PRIMARY KEY (UserID));
    
CREATE SEQUENCE userID_seq START WITH 1;

UPDATE Guests SET CreatedAt = CURRENT_TIMESTAMP, UpdatedAT = CURRENT_TIMESTAMP;

INSERT INTO Guests(FName, LName, Password, Email, Address, Tel, UserType, LoyalCustomer, DiscountRate) VALUES('TestFirstName', 'TestLastName', 'password', 'test@ryerson.ca', 'Test Address', 647999111, 'Guest', 'Y', 10);
UPDATE Guests SET FName = 'Afshar';

CREATE OR REPLACE TRIGGER create_timestamp
BEFORE INSERT ON GUESTS
FOR EACH ROW
BEGIN
    :NEW.CreatedAt := SYSDATE;
    SELECT userID_seq.nextval
    INTO :NEW.UserID
    FROM DUAL;
END;

CREATE OR REPLACE TRIGGER update_timestamp
BEFORE UPDATE ON GUESTS
FOR EACH ROW
BEGIN
    :NEW.UpdatedAt := SYSDATE;
END;

