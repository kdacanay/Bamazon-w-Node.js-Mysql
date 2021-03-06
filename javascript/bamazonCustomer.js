var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require('chalk');
var table = require("table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root1234",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    //-----Display a Welcome Message-----------//
    console.log(chalk.bgMagenta("\n=============================================================================="));
    console.log(chalk.bgMagenta("\n=============================WELCOME TO BAMAZON==============================="));
    console.log(chalk.bgMagenta("\n=============================================================================="));

    console.log("\nConnected as ID: " + connection.threadId + "\n");

    customerInquirer();
});


function customerInquirer() {
    //-------prompt customer------------//
    inquirer
        .prompt({
            type: "list",
            name: "purchase",
            message: "Would you like to make a purchase today?",
            choices: [
                "YES",
                "NO"
            ]
        })
        .then(function (answer) {
            if (answer.purchase === "YES") {
                displayProducts();
            } else if (answer.purchase === "NO") {
                console.log(chalk.bgMagenta("\n=============================================================================="));
                console.log(chalk.bgMagenta("\n===================Thank You For Shopping With Bamazon!======================="));
                console.log(chalk.bgMagenta("\n=============================================================================="));

                connection.end();
            }
        })
}

function displayProducts() {

    console.log(chalk.bgBlue("\n=============================================================================="));
    console.log(chalk.bgBlue("\n=========================Today's Available Products==========================="));
    console.log(chalk.bgBlue("\n=============================================================================="));

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //load products w/console.table
        console.table(res);
    });
    setTimeout(() => {


        inquirer
            .prompt({
                type: "list",
                name: "continue",
                message: "Would you like to continue?",
                choices: [
                    "YES",
                    "NO"
                ]
            })
            .then(function (answer) {
                if (answer.continue === "YES") {
                    customerPurchase();
                } else if (answer.continue === "NO") {
                    console.log(chalk.bgMagenta("\n=============================================================================="));
                    console.log(chalk.bgMagenta("\n===================Thank You For Shopping With Bamazon!======================="));
                    console.log(chalk.bgMagenta("\n=============================================================================="));

                    connection.end();
                }
            })
    }, 1000);
}

function customerPurchase() {
    //----inquirer customer of id and check inventory-------//
    //-----if available run quantity function-------//
    inquirer
        .prompt({
            type: "input",
            name: "itemID",
            message: "What is the ID of the product you wish to purchase?",
            validate: function (value) {
                if (value) {
                    return true;
                }
                return false;
            }
        })
        .then((function (answer) {
            connection.query("SELECT ITEM_ID, PRODUCT_NAME, DEPARTMENT_NAME, PRICE, STOCK_QUANTITY FROM products WHERE ?", {
                ITEM_ID: answer.itemID
            }, function (err, res) {
                if (err) throw err;
                if (res) {
                    displayItem = (chalk.cyan("Item Id: " + res[0].ITEM_ID + " | " + "Product: " + res[0].PRODUCT_NAME + " | " + " Price: " + res[0].PRICE));
                    productPrice = res[0].PRICE;
                    console.log(productPrice);
                    continuePurchase(displayItem);
                }
            });
        }))
}

function continuePurchase(displayItem) {
    inquirer
        .prompt({
            type: "list",
            name: "confirm",
            message: "Continue purchasing : " + displayItem + " ?",
            choices: [
                "YES",
                "NO"
            ]
        })
        .then(function (answer) {
            if (answer.confirm === "YES") {
                queryQuantity(displayItem);
            } else if (answer.confirm === "NO") {

                console.log(chalk.bgMagenta("\n=============================================================================="));
                console.log(chalk.bgMagenta("\n===================Thank You For Shopping With Bamazon!======================="));
                console.log(chalk.bgMagenta("\n=============================================================================="));

                console.log(chalk.yellow("\n==========================REDIRECTING============================="));
                setTimeout(() => {
                    displayProducts();
                }, 1000);
            }
        })

}

function queryQuantity(displayItem, productArray) {
    var productArray = displayItem.split(" ", 3);
    inquirer
        .prompt({
            type: "input",
            name: "quantity",
            message: "Please enter a quantity for: " + displayItem + " : ",
            validate: function (value) {
                if (value) {
                    return true;
                }
                return false;
            }
        })
        .then((function (answer) {
            connection.query("SELECT STOCK_QUANTITY FROM products WHERE ?", {
                ITEM_ID: productArray[2]
            }, function (err, res) {
                finalProductId = parseInt(productArray[2]);
                // console.log(productArray);
                // console.log("IS IT WORKING?");
                productAmount = parseInt(answer.quantity);
                // console.log(productAmount);
                // console.log(finalProductId);
                // console.log(displayItem);
                if (err) throw err;
                if (res) {
                    if (productAmount <= res[0].STOCK_QUANTITY) {
                        finalizePurchase();
                    } else if (productAmount > res[0].STOCK_QUANTITY) {
                        console.log(chalk.yellow("\nWe're sorry, there is not enough in stock. Please try again with a lower quantity.\n"));
                        console.log(chalk.yellow("\n======================REDIRECTING============================\n"));
                        setTimeout(() => {
                            displayProducts();
                        }, 1000);
                    }
                }
            });
        }))
}


function finalizePurchase() {

    inquirer
        .prompt({
            type: "list",
            name: "continue",
            message: "Continue With Purchase?",
            choices: [
                "YES",
                "NO"
            ]
        })
        .then(function (answer) {
            if (answer.continue === "YES") {
                finalTotal = (productAmount * productPrice);
                // console.log(productAmount);
                // console.log(finalProductId);
                console.log(chalk.yellow("\n=====================Finalizing Your Purchase=========================\n"));
                connection.query("UPDATE products SET STOCK_QUANTITY = stock_quantity - ?, PRODUCT_SALES = product_sales + ? WHERE ITEM_ID = ?",
                    [productAmount, finalTotal, finalProductId],
                    function (err, res) {
                        if (err) throw err;
                        if (res) {
                            // console.log(res);
                            console.log(chalk.yellow("\nYou have successfully purchased " + productAmount + " " + displayItem + " !\n"));
                            console.log(chalk.yellow("\nYour Final Total: " + finalTotal + "."))
                            console.log(chalk.bgMagenta("\n=============================================================================="));
                            console.log(chalk.bgMagenta("\n===================Thank You For Shopping With Bamazon!======================="));
                            console.log(chalk.bgMagenta("\n=============================================================================="));
                            console.log(chalk.yellow("\n==========================REDIRECTING============================="));
                            setTimeout(() => {
                                displayProducts();
                            }, 1000);
                        }
                    })
            } else if (answer.continue === "NO") {

                console.log(chalk.bgMagenta("\n=============================================================================="));
                console.log(chalk.bgMagenta("\n===================Thank You For Shopping With Bamazon!======================="));
                console.log(chalk.bgMagenta("\n=============================================================================="));
                console.log(chalk.yellow("\n==========================REDIRECTING=================================\n"));
                setTimeout(() => {
                    displayProducts();
                }, 1000);
            }
        })
}