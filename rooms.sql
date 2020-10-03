CREATE TABLE Rooms(
      RoomID NUMBER,
      StaffID NUMBER REFERENCES Staff(UserID),
      Price NUMBER(7,2),
      BedNumber NUMBER,
      BathNumber NUMBER,
      WindowNumber NUMBER,
      RoomStatus VARCHAR2(50)
);

ALTER TABLE Rooms ADD (
    CONSTRAINT roomID_pk PRIMARY KEY (RoomID));