var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("\n==============================================================================");
    console.log("\n=============================WELCOME TO BAMAZON===============================");
    console.log("\n==============================================================================");

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
                console.log("\n==============================================================================");
                console.log("\n===================Thank You For Shopping With Bamazon!=======================");
                console.log("\n==============================================================================");

                connection.end();
            }
        })
}

function displayProducts() {

    console.log("\n==============================================================================");
    console.log("\n=========================Today's Available Products===========================");
    console.log("\n==============================================================================");

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
                    console.log("\nThank You For Shopping With Bamazon!");
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
                    var displayItem = ("Item Id: " + res[0].ITEM_ID + " | " + "Product: " + res[0].PRODUCT_NAME + " | " + " Price: " + res[0].PRICE);
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

                console.log("\n==============================================================================");
                console.log("\n===================Thank You For Shopping With Bamazon!=======================");
                console.log("\n==============================================================================");

                displayProducts();
            }
        })

}

function queryQuantity(displayItem) {
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
                console.log(productArray);
                console.log("IS IT WORKING?");
                if (err) throw err;
                if (res) {
                    if (answer.quantity < res[0].STOCK_QUANTITY) {
                        finalizePurchase();
                    } else if (answer.quantity > res[0].STOCK_QUANTITY) {
                        console.log("\nWe're sorry, there is not enough in stock. Please try proceeding with a lower quantity")
                        continuePurchase(displayItem);
                    }
                }
            });
        }))
}

function finalizePurchase(displayItem) {
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
                console.log("OK");
            } else if (answer.continue === "NO") {

                console.log("\n==============================================================================");
                console.log("\n===================Thank You For Shopping With Bamazon!=======================");
                console.log("\n==============================================================================");

                displayProducts();
            }
        })
}