CREATE TABLE HotelServices(
      ServiceID NUMBER,
      ReserveID NUMBER,
      Status VARCHAR2(50),
      RequiresBooking CHAR(1),
      StaffID NUMBER REFERENCES STAFF(UserID),
      ServiceName VARCHAR2(100),
      BookedTo TIMESTAMP,
      BookedFrom TIMESTAMP,
      ServiceRate NUMBER(6,2)
);

ALTER TABLE HotelServices ADD (
    CONSTRAINT serviceID_pk PRIMARY KEY (ServiceID));
    
CREATE SEQUENCE serviceID_seq START WITH 1;

CREATE OR REPLACE TRIGGER serviceID_trigger
BEFORE INSERT ON HOTELSERVICES
FOR EACH ROW
BEGIN
    SELECT serviceID_seq.nextval
    INTO :NEW.ServiceID
    FROM DUAL;
END;


