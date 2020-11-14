const dbConfig = require("../config/database");
const oracledb = require("oracledb");
oracledb.autoCommit = true;

const CREATE_SCRIPTS = [
  {
    tableName: "users",
    scripts: [
      `CREATE TABLE Users(
        UserID NUMBER PRIMARY KEY,
        FName VARCHAR2 ( 100 ) NOT NULL ,
        LName VARCHAR2 ( 100 ) NOT NULL ,
        Password VARCHAR2 ( 100 ) NOT NULL ,
        Email VARCHAR2 ( 200 ) NOT NULL ,
        Address VARCHAR2 ( 200 ) NOT NULL ,
        Tel VARCHAR2 ( 200 ) NOT NULL ,
        UserType VARCHAR2 ( 50 ) NOT NULL ,
        CreatedAt TIMESTAMP ,
        UpdatedAt TIMESTAMP)`,
      `CREATE SEQUENCE userID_seq START WITH 1`,
      `CREATE OR REPLACE TRIGGER create_timestamp
        BEFORE INSERT ON Users
        FOR EACH ROW
        BEGIN
        :NEW.CreatedAt := SYSDATE ;
        SELECT userID_seq.nextval
        INTO :NEW.UserID
        FROM DUAL;
        END;`,
      `CREATE OR REPLACE TRIGGER update_timestamp
        BEFORE UPDATE ON Users
        FOR EACH ROW
        BEGIN
        :NEW.UpdatedAt := SYSDATE ;
        END;`,
    ],
  },
  {
    tableName: "guests",
    scripts: [
      `CREATE TABLE Guests(
        UserID NUMBER REFERENCES Users (UserID) UNIQUE,
        LoyalCustomer CHAR ( 1 ),
        DiscountRate NUMBER ( 4 , 2 )
        )`,
    ],
  },
  {
    tableName: "staff",
    scripts: [
      `CREATE TABLE Staff(
        UserID NUMBER REFERENCES Users (UserID) NOT NULL UNIQUE,
        Title VARCHAR2 ( 100 ) NOT NULL ,
        Department VARCHAR2 ( 200 ) NOT NULL ,
        ManagerID NUMBER REFERENCES Users (UserID) NOT NULL
        )`,
    ],
  },
  {
    tableName: "visits",
    scripts: [
      `CREATE TABLE Visits(
        ReserveID NUMBER PRIMARY KEY,
        RoomID NUMBER REFERENCES ROOMS (RoomID),
        GuestID NUMBER REFERENCES GUESTS (UserID),
        Status VARCHAR2 ( 50 ),
        AdultsNumber NUMBER ,
        ChildrenNumber NUMBER ,
        Deposit NUMBER ( 10 , 2 ),
        CheckOutTime TIMESTAMP ,
        CheckInTime TIMESTAMP
        )`,
      `CREATE SEQUENCE reserveID_seq START WITH 1`,
      `CREATE OR REPLACE TRIGGER reserveID_trigger
        BEFORE INSERT ON VISITS
        FOR EACH ROW
        BEGIN
        SELECT reserveID_seq.nextval
        INTO :NEW.ReserveID
        FROM DUAL;
        END;`,
    ],
  },
  {
    tableName: "rooms",
    scripts: [
      `CREATE TABLE Rooms(
        RoomID NUMBER PRIMARY KEY,
        StaffID NUMBER REFERENCES Staff(UserID),
        Price NUMBER ( 7 , 2 ),
        BedNumber NUMBER ,
        BathNumber NUMBER ,
        WindowNumber NUMBER ,
        RoomStatus VARCHAR2 ( 50 )
        )`,
    ],
  },
  {
    tableName: "payments",
    scripts: [
      `
      CREATE TABLE PAYMENTS(
        PaymentID NUMBER PRIMARY KEY,
        PaymentType VARCHAR2 ( 100 ),
        Amount NUMBER ( 20 , 2 ),
        VisitID NUMBER REFERENCES VISITS (ReserveID),
        Timestamp TIMESTAMP
        )`,
      `CREATE SEQUENCE paymentID_seq START WITH 1`,
      `CREATE OR REPLACE TRIGGER paymentID_trigger
        BEFORE INSERT ON PAYMENTS
        FOR EACH ROW
        BEGIN
        SELECT paymentID_seq.nextval
        INTO :NEW.PaymentID
        FROM DUAL;
        END;`,
    ],
  },
  {
    tableName: "payrates",
    scripts: [
      `CREATE TABLE PAYRATES(
          TITLE VARCHAR2 ( 100 ) NOT NULL,
          PAYRATE NUMBER ( 4, 2 ) NOT NULL
        )`,
    ],
  },
  {
    tableName: "hotelservices",
    scripts: [
      `CREATE TABLE HotelServices(
        ServiceID NUMBER PRIMARY KEY,
        Status VARCHAR2 ( 50 ),
        RequiresBooking CHAR ( 1 ),
        StaffID NUMBER REFERENCES STAFF(UserID),
        ServiceName VARCHAR2 ( 100 ),
        ServiceRate NUMBER ( 6 , 2 )
        )`,
      `CREATE SEQUENCE serviceID_seq START WITH 1`,
      `CREATE OR REPLACE TRIGGER serviceID_trigger
        BEFORE INSERT ON HOTELSERVICES
        FOR EACH ROW
        BEGIN
        SELECT serviceID_seq.nextval
        INTO :NEW.ServiceID
        FROM DUAL;
        END;`,
    ],
  },
  {
    tableName: "hotelservicesbookings",
    scripts: [
      `CREATE TABLE HotelServicesBookings(
        BookingID NUMBER PRIMARY KEY,
        ServiceID NUMBER REFERENCES HotelServices(ServiceID),
        ReserveID NUMBER REFERENCES Visits(ReserveID),
        BookedTo TIMESTAMP ,
        BookedFrom TIMESTAMP
        )`,
      `CREATE SEQUENCE bookingID_seq START WITH 1`,
      `CREATE OR REPLACE TRIGGER bookingID_trigger
        BEFORE INSERT ON HOTELSERVICESBOOKINGS
        FOR EACH ROW
        BEGIN
        SELECT bookingID_seq.nextval
        INTO :NEW.BookingID
        FROM DUAL;
        END;`,
    ],
  },
];

const DELETE_SCRIPTS = [
  {
    tableName: "users",
    scripts: [
      `DROP TABLE USERS CASCADE CONSTRAINTS`,
      `DROP SEQUENCE userID_seq`,
    ],
  },
  {
    tableName: "guests",
    scripts: [`DROP TABLE GUESTS CASCADE CONSTRAINTS`],
  },
  {
    tableName: "staff",
    scripts: [`DROP TABLE STAFF CASCADE CONSTRAINTS`],
  },
  {
    tableName: "visits",
    scripts: [
      `DROP TABLE VISITS CASCADE CONSTRAINTS`,
      `DROP SEQUENCE reserveID_seq`,
    ],
  },
  {
    tableName: "rooms",
    scripts: [`DROP TABLE ROOMS CASCADE CONSTRAINTS`],
  },
  {
    tableName: "payments",
    scripts: [
      `DROP TABLE PAYMENTS CASCADE CONSTRAINTS`,
      `DROP SEQUENCE paymentID_seq`,
    ],
  },
  {
    tableName: "payrates",
    scripts: [`DROP TABLE PAYRATES`],
  },
  {
    tableName: "hotelservices",
    scripts: [
      `DROP TABLE HOTELSERVICES CASCADE CONSTRAINTS`,
      `DROP SEQUENCE serviceID_seq`,
    ],
  },
  {
    tableName: "hotelservicesbookings",
    scripts: [
      `DROP TABLE HotelServicesBookings CASCADE CONSTRAINTS`,
      `DROP SEQUENCE bookingID_seq`,
    ],
  },
];

const POPULATE_SCRIPTS = [
  {
    tableName: "users",
    scripts: [
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Roseann', 'Farrier', 'password', 'rfarrier@gmail.com', '99 Beach Circle Crystal Lake, IL 60014', '4529872351', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Xochitl', 'Jared', 'password', 'xjared@gmail.com', '9630 Cardinal St. Ellicott City, MD 21042', '2025550154', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Tatum', 'Mccoin', 'password', 'tmccoin@gmail.com', '9 Warren Rd. Northville, MI 48167', '2697694270', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Robert', 'Smith', 'password', 'rsmith@gmail.com', '9094 Coffee Rd. Oklahoma City, OK 73112', '6203009591', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Maria', 'Garcia', 'password', 'mgarcia@gmail.com', '7559 Mayfair Drive Wallingford, CT 06492', '4172766091', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('David', 'Roberts', 'password', 'droberts@gmail.com', '9517 Catherine Street Lenoir, NC 28645', '8567029330', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Maria', 'Martinez', 'password', 'mmartinez@gmail.com', '355 Lake View Drive Encino, CA 91316', '3372697518', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('James', 'Johnson', 'password', 'jjohnson@gmail.com', '9591 Prospect St. Palos Verdes Peninsula, CA 90274', '4079978602', 'Employee')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Loreen', 'Lake', 'password', 'llake@gmail.com', '34 White Drive Lemont, IL 60439', '4529872351', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Tonie', 'Marcum', 'password', 'tmarcum@gmail.com', '30 Lantern Street Birmingham, AL 35209', '8106565576', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Tory', 'Moser', 'password', 'tmoser@gmail.com', '7559 Mayfair Drive Wallingford, CT 06492', '5867704232', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Paul', 'Ives', 'password', 'pives@gmail.com', '574 Bank St. New Britain, CT 06051', '3105378840', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Rod', 'Walker', 'password', 'rwalker@gmail.com', '9426 NE. Valley Farms Court Osseo, MN 55311', '7725387571', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('John', 'Lee', 'password', 'jlee@gmail.com', '808 Sycamore Ave. Ladson, SC 29456', '2174639149', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Elvin', 'Toker', 'password', 'etoker@gmail.com', '7043 Harvey St. Holyoke, MA 01040', '6672034636', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Adele', 'Hatten', 'password', 'ahatten@gmail.com', '381 Old York Street Xenia, OH 45385', '2487337777', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Derrick', 'Centers', 'password', 'dcenters@gmail.com', '8915 Cedar Swamp Lane Wausau, WI 54401', '2703721635', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Clint', 'Fickett', 'password', 'cfickett@gmail.com', '3 Proctor St. Rego Park, NY 11374', '4796562836', 'Guest')`,
      `INSERT INTO USERS(FNAME, LNAME, PASSWORD, EMAIL, ADDRESS, TEL, USERTYPE) VALUES('Christeen', 'Damian', 'password', 'cdamien@gmail.com', '530 Rockwell St. Providence, RI 02904', '2166598329', 'Guest')`,
    ],
  },
  {
    tableName: "guests",
    scripts: [
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(9, 'Y', 15)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(10, 'N', NULL)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(11, 'N', NULL)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(12, 'N', NULL)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(13, 'N', NULL)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(14, 'N', NULL)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(15, 'N', NULL)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(16, 'N', NULL)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(17, 'Y', 15)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(18, 'Y', 20)`,
      `INSERT INTO GUESTS(USERID, LOYALCUSTOMER, DISCOUNTRATE) VALUES(19, 'Y', 15)`,
    ],
  },
  {
    tableName: "staff",
    scripts: [
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(1, 'CONCIERGE', 'FRONT OFFICE', 8)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(2, 'CONCIERGE', 'FRONT OFFICE', 8)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(3, 'CONCIERGE', 'FRONT OFFICE', 8)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(4, 'HOUSE KEEPER', 'HOUSE KEEPING', 8)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(5, 'HOUSE KEEPER', 'HOUSE KEEPING', 8)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(6, 'HOUSE KEEPER', 'HOUSE KEEPING', 8)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(7, 'HR ADMINISTRATOR', 'HUMAN RESOURCES', 9)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(8, 'EXECUTIVE MANAGER', 'FRONT OFFICE', 9)`,
      `INSERT INTO STAFF(USERID, TITLE, DEPARTMENT, MANAGERID) VALUES(9, 'GENERAL MANAGER', 'FRONT OFFICE', 9)`,
    ],
  },
  {
    tableName: "payrates",
    scripts: [
      `INSERT INTO PAYRATES(TITLE, PAYRATE) VALUES ('CONCIERGE', 21)`,
      `INSERT INTO PAYRATES(TITLE, PAYRATE) VALUES ('HOUSE KEEPER', 15)`,
      `INSERT INTO PAYRATES(TITLE, PAYRATE) VALUES ('HR ADMINISTRATOR', 26)`,
      `INSERT INTO PAYRATES(TITLE, PAYRATE) VALUES ('EXECUTIVE MANAGER', 32)`,
      `INSERT INTO PAYRATES(TITLE, PAYRATE) VALUES ('GENERAL MANAGER', 81)`,
    ],
  },
  {
    tableName: "rooms",
    scripts: [
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1001, 4, 120, 1, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1002, 4, 120, 1, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1003, 4, 150, 2, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1004, 4, 150, 2, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1101, 5, 120, 1, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1102, 5, 120, 1, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1103, 5, 150, 2, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1104, 5, 150, 2, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1201, 6, 120, 1, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1202, 6, 120, 1, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1203, 6, 160, 2, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1204, 6, 160, 2, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1301, 4, 140, 1, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1302, 4, 140, 1, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1303, 4, 160, 2, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1304, 4, 160, 2, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1401, 5, 160, 1, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1402, 5, 160, 1, 1, 2, 'EMPTY')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1403, 6, 180, 2, 1, 2, 'BOOKED')`,
      `INSERT INTO ROOMS(ROOMID, STAFFID, PRICE, BEDNUMBER, BATHNUMBER, WINDOWNUMBER, ROOMSTATUS) VALUES(1404, 6, 180, 2, 1, 2, 'BOOKED')`,
    ],
  },
  {
    tableName: "visits",
    scripts: [
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1001, 9, 'CHECKEDIN', 1, 1, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1004, 10, 'BOOKED', 2, 1, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1102, 11, 'BOOKED', 1, 0, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1201, 12, 'CHECKEDIN', 1, 0, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1202, 13, 'CHECKEDIN', 2, 1, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1203, 14, 'CHECKEDIN', 2, 0, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1204, 15, 'BOOKED', 2, 1, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1303, 16, 'CHECKEDIN', 2, 2, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1304, 17, 'CHECKEDIN', 1, 1, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1403, 18, 'BOOKED', 1, 1, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
      `INSERT INTO VISITS(ROOMID, GUESTID, STATUS, ADULTSNUMBER, CHILDRENNUMBER, DEPOSIT, CHECKOUTTIME, CHECKINTIME) VALUES(1404, 19, 'CHECKEDIN', 2, 1, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(7, 'day'))`,
    ],
  },
  {
    tableName: "payments",
    scripts: [
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('MASTERCARD', 840, 1, CURRENT_TIMESTAMP - NUMTODSINTERVAL(3, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('DEBIT', 300, 2, CURRENT_TIMESTAMP - NUMTODSINTERVAL(2, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('DEBIT', 300, 3, CURRENT_TIMESTAMP - NUMTODSINTERVAL(10, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('AMERICAN EXPRESS', 840, 4, CURRENT_TIMESTAMP - NUMTODSINTERVAL(17, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('VISA', 840, 5, CURRENT_TIMESTAMP - NUMTODSINTERVAL(2, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('MASTERCARD', 1120, 6, CURRENT_TIMESTAMP - NUMTODSINTERVAL(1, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('PAYPAL', 300, 7, CURRENT_TIMESTAMP - NUMTODSINTERVAL(26, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('AMERICAN EXPRESS', 1120, 8, CURRENT_TIMESTAMP - NUMTODSINTERVAL(31, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('MASTERCARD', 1120, 9, CURRENT_TIMESTAMP - NUMTODSINTERVAL(12, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('VISA', 300, 10, CURRENT_TIMESTAMP - NUMTODSINTERVAL(22, 'day'))`,
      `INSERT INTO PAYMENTS(PAYMENTTYPE, AMOUNT, VISITID, TIMESTAMP) VALUES('MASTERCARD', 1260, 11, CURRENT_TIMESTAMP - NUMTODSINTERVAL(1, 'day'))`,
    ],
  },
  {
    tableName: "hotelservices",
    scripts: [
      `INSERT INTO HOTELSERVICES(STATUS, REQUIRESBOOKING, STAFFID, SERVICENAME, SERVICERATE) VALUES('NOT FULL', 'Y', 4, 'SWIMMING POOL', NULL)`,
      `INSERT INTO HOTELSERVICES(STATUS, REQUIRESBOOKING, STAFFID, SERVICENAME, SERVICERATE) VALUES('NOT FULL', 'Y', 4, 'GYM', NULL)`,
      `INSERT INTO HOTELSERVICES(STATUS, REQUIRESBOOKING, STAFFID, SERVICENAME, SERVICERATE) VALUES('NOT FULL', 'N', 6, 'TENNIS COURT', 22)`,
      `INSERT INTO HOTELSERVICES(STATUS, REQUIRESBOOKING, STAFFID, SERVICENAME, SERVICERATE) VALUES('FULL', 'Y', 6, 'SPA', 45)`,
    ],
  },
  {
    tableName: "hotelservicesbookings",
    scripts: [
      `INSERT INTO HOTELSERVICESBOOKINGS(RESERVEID, SERVICEID, BOOKEDTO, BOOKEDFROM) VALUES(1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(0.5, 'hour'))`,
      `INSERT INTO HOTELSERVICESBOOKINGS(RESERVEID, SERVICEID, BOOKEDTO, BOOKEDFROM) VALUES(1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + NUMTODSINTERVAL(0.5, 'hour'))`,
    ],
  },
];

module.exports.createTable = async (req, res, next) => {
  try {
    const tblName = req.body.tableName;
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");

    var tblScripts = CREATE_SCRIPTS.find(
      (script) => script.tableName === tblName
    );
    console.log(tblScripts);
    for (var i = 0; i < tblScripts.scripts.length; i++) {
      console.log(tblScripts.scripts[i]);
      var result = await connection.execute(tblScripts.scripts[i]);
      connection.commit();
    }
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.createAll = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    const tables = [
      "users",
      "guests",
      "staff",
      "payrates",
      "rooms",
      "visits",
      "payments",
      "hotelservices",
      "hotelservicesbookings",
    ];
    for (var j = 0; j < tables.length; j++) {
      const table = CREATE_SCRIPTS.find(
        (script) => script.tableName === tables[j]
      );
      for (var i = 0; i < table.scripts.length; i++) {
        console.log(table.scripts[i]);
        var result = await connection.execute(table.scripts[i]);
        connection.commit();
      }
    }

    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.deleteTable = async (req, res, next) => {
  try {
    const tblName = req.body.tableName;
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");

    var tblScripts = DELETE_SCRIPTS.find(
      (script) => script.tableName === tblName
    );
    console.log(tblScripts);
    for (var i = 0; i < tblScripts.scripts.length; i++) {
      console.log(tblScripts.scripts[i]);
      var result = await connection.execute(tblScripts.scripts[i]);
      connection.commit();
    }
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.deleteRecord = async (req, res, next) => {
  try {
    const script = req.body.script;
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");

    var result = await connection.execute(script);
    connection.commit();

    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.populateTable = async (req, res, next) => {
  try {
    const tblName = req.body.tableName;
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");

    var tblScripts = POPULATE_SCRIPTS.find(
      (script) => script.tableName === tblName
    );
    console.log(tblScripts);
    for (var i = 0; i < tblScripts.scripts.length; i++) {
      console.log(tblScripts.scripts[i]);
      var result = await connection.execute(tblScripts.scripts[i]);
      connection.commit();
    }
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.populateAll = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    const tables = [
      "users",
      "guests",
      "staff",
      "payrates",
      "rooms",
      "visits",
      "payments",
      "hotelservices",
      "hotelservicesbookings",
    ];
    for (var j = 0; j < tables.length; j++) {
      const table = POPULATE_SCRIPTS.find(
        (script) => script.tableName === tables[j]
      );
      for (var i = 0; i < table.scripts.length; i++) {
        console.log(table.scripts[i]);
        var result = await connection.execute(table.scripts[i]);
        connection.commit();
      }
    }
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.deleteAll = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    const tables = [
      "users",
      "guests",
      "staff",
      "payrates",
      "rooms",
      "visits",
      "payments",
      "hotelservices",
      "hotelservicesbookings",
    ];
    for (var j = 0; j < tables.length; j++) {
      const table = DELETE_SCRIPTS.find(
        (script) => script.tableName === tables[j]
      );
      for (var i = 0; i < table.scripts.length; i++) {
        console.log(table.scripts[i]);
        var result = await connection.execute(table.scripts[i]);
        connection.commit();
      }
    }
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM USERS`);
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          USERID: result.rows[i][0],
          FNAME: result.rows[i][1],
          LNAME: result.rows[i][2],
          PASSWORD: result.rows[i][3],
          EMAIL: result.rows[i][4],
          ADDRESS: result.rows[i][5],
          TEL: result.rows[i][6],
          USERTYPE: result.rows[i][7],
          CREATEDAT: `${result.rows[i][8]}`,
          UPDATEDAT: result.rows[i][9],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getGuests = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM GUESTS`);
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          USERID: result.rows[i][0],
          LOYALCUSTOMER: result.rows[i][1],
          DISCOUNTRATE: result.rows[i][2],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getStaff = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM STAFF`);
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          USERID: result.rows[i][0],
          TITLE: result.rows[i][1],
          DEPARTMENT: result.rows[i][2],
          MANAGERID: result.rows[i][3],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getPayRates = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM PAYRATES`);
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          TITLE: result.rows[i][0],
          PAYRATE: result.rows[i][1],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getRooms = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM ROOMS`);
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          ROOMID: result.rows[i][0],
          STAFFID: result.rows[i][1],
          PRICE: result.rows[i][2],
          BEDNUMBER: result.rows[i][3],
          BATHNUMBER: result.rows[i][4],
          WINDOWNUMBER: result.rows[i][5],
          ROOMSTATUS: result.rows[i][6],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getVisits = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM VISITS`);
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          VISITID: result.rows[i][0],
          ROOMID: result.rows[i][1],
          GUESTID: result.rows[i][2],
          STATUS: result.rows[i][3],
          ADULTSNUMBER: result.rows[i][4],
          CHILDRENNUMBER: result.rows[i][5],
          DEPOSIT: result.rows[i][6],
          CHECKOUTTIME: result.rows[i][7],
          CHECKINTIME: `${result.rows[i][8]}`,
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getPayments = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM PAYMENTS`);
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          PAYMENTID: result.rows[i][0],
          PAYMENTTYPE: result.rows[i][1],
          AMOUNT: result.rows[i][2],
          VISITID: result.rows[i][3],
          TIMESTAMP: result.rows[i][4],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getHotelServices = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(`SELECT * FROM HOTELSERVICES`);
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          SERVICEID: result.rows[i][0],
          STATUS: result.rows[i][1],
          REQUIRESBOOKING: result.rows[i][2],
          STAFFID: result.rows[i][3],
          SERVICENAME: result.rows[i][4],
          SERVICERATE: result.rows[i][5],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.getHotelServicesBookings = async (req, res) => {
  try {
    var connection = await oracledb.getConnection(dbConfig.hrConnection);
    console.log("connected!");
    var result = await connection.execute(
      `SELECT * FROM HOTELSERVICESBOOKINGS`
    );
    connection.commit();
    const finalResult = [];
    console.log(result);
    if (result.rows.length) {
      for (var i = 0; i < result.rows.length; i++) {
        const tempUser = {
          BOOKINGID: result.rows[i][0],
          RESERVEID: result.rows[i][1],
          SERVICEID: result.rows[i][2],
          BOOKEDTO: result.rows[i][3],
          BOOKEDFROM: result.rows[i][4],
        };
        finalResult.push(tempUser);
      }
      res.status(200).send({ message: "success", result: finalResult });
    } else {
      console.log("No rows fetched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports.executeScript = async (req, res, next) => {
  var result;
  const script = req.body.script;
  var connection = await oracledb.getConnection(dbConfig.hrConnection);
  try {
    result = await connection.execute(script);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log(result);
        res.status(200).send({ message: "success", "result": result });
      } catch (err) {
        console.error(err);
      }
    }
  }
};
