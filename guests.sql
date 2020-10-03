CREATE TABLE Guests(
      UserID NUMBER REFERENCES Users (UserID) UNIQUE,
      LoyalCustomer CHAR(1),
      DiscountRate NUMBER(4,2)
);