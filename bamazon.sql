DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products
(
    Item_Id INT
    AUTO_INCREMENT NOT NULL,
    Product_Name VARCHAR
    (100) NOT NULL,
    Department_Name VARCHAR
    (100) NOT NULL,
    Price DECIMAL
    (10,2) NOT NULL,
    Stock_Quantity INT
    (10) NOT NULL,
    PRIMARY KEY
    (item_id)
);



    INSERT INTO products
        (PRODUCT_NAME, DEPARTMENT_NAME, PRICE, STOCK_QUANTITY)
    VALUES
        ("Samsung Notebook 9 Pro 15", "Electronics", 1050.00, 12),
        ("Jammed Stapler", "Office", 8.05, 35),
        ("Playstation 4 Pro", "Electronics", 399.99, 20),
        ("Men's Levi's Denim Jacket w/holes sz/Lg", "Clothing", 74.95, 6),
        ("Half Eaten Box of Frosted Flakes", "Food", 3.75, 50),
        ("Men's North Face Zip Up Hoodie Black sz/Lg", "Clothing", 60, 12),
        ("Totino's Pizza Rolls 250 ct", "Food", 6.99, 25),
        ("Pack of 10 Paper Clips from Junk Drawer w/Chewed Pen Caps", "Office", 2.50, 30),
        ("Acer 24.5 Gaming Monitor 144hz HDR", "Electronics", 229.99, 9),
        ("Partially Constructed Computer Desk from IKEA", "Office", 120.00, 3)

    SELECT *
    FROM products;