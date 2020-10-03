CREATE TABLE Visits(
      ReserveID NUMBER,
      RoomID NUMBER REFERENCES ROOMS (RoomID),
      GuestID NUMBER REFERENCES GUESTS (UserID),
      Status VARCHAR2(50),
      AdultsNumber NUMBER,
      ChildrenNumber NUMBER,
      Deposit NUMBER(10,2),
      CheckOutTime TIMESTAMP,
      CheckInTime TIMESTAMP
);

ALTER TABLE Visits ADD (
    CONSTRAINT reserveID_pk PRIMARY KEY (ReserveID));
    
CREATE SEQUENCE reserveID_seq START WITH 1;

CREATE OR REPLACE TRIGGER reserveID_trigger
BEFORE INSERT ON VISITS
FOR EACH ROW
BEGIN
    SELECT reserveID_seq.nextval
    INTO :NEW.ReserveID
    FROM DUAL;
END;