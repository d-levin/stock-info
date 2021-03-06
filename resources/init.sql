DROP TABLE IF EXISTS STOCK;
CREATE TABLE STOCK (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  SYMBOL VARCHAR(15) NOT NULL UNIQUE,
  NAME VARCHAR(255) NOT NULL
);

MERGE INTO STOCK (SYMBOL, NAME) KEY (SYMBOL)
SELECT SYMBOL,
       NAME
  FROM CSVREAD('companylist-amex.csv');

MERGE INTO STOCK (SYMBOL, NAME) KEY (SYMBOL)
SELECT SYMBOL,
       NAME
  FROM CSVREAD('companylist-nasdaq.csv', null, 'writeColumnHeader=false');

MERGE INTO STOCK (SYMBOL, NAME) KEY (SYMBOL)
SELECT SYMBOL,
       NAME
  FROM CSVREAD('companylist-nyse.csv', null, 'writeColumnHeader=false');
