var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require('chalk');

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

    managerMenu();
});

function managerMenu() {
    //---------prompt manager-----------------//
    inquirer
        .prompt({
            type: "list",
            name: "select",
            message: "Please make a selection: ",
            choices: [
                "VIEW PRODUCTS FOR SALE",
                "VIEW LOW INVENTORY",
                "ADD TO INVENTORY",
                "ADD NEW PRODUCT"
            ]
        })
        .then(function (answer) {
            if (answer.select === "VIEW PRODUCTS FOR SALE") {
                productView();
            } else if (answer.select === "VIEW LOW INVENTORY") {
                lowInventory();
            } else if (answer.select === "ADD TO INVENTORY") {
                addToInventory();
            } else if (answer.select === "ADD NEW PRODUCT") {
                addProduct();
            } else {
                connection.end();
            }
        })
}

function productView() {

    console.log(chalk.bgBlue("\n=======================Available Products For Sale========================\n"));

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
                message: "Return to Menu?",
                choices: [
                    "YES",
                    "NO"
                ]
            })
            .then(function (answer) {
                if (answer.continue === "YES") {
                    managerMenu();
                } else if (answer.continue === "NO") {
                    connection.end();
                }
            })
    }, 1000);
}

function lowInventory() {
    //connection query to select all products below <= 5
    console.log(chalk.yellow("\n======================These Products Are Low on Stock============================\n"));
    connection.query("SELECT * FROM products WHERE STOCK_QUANTITY <= 5", function (err, res) {
        if (err) throw err;
        //display w/console.table
        console.table(res);
        setTimeout(() => {

            inquirer
                .prompt({
                    type: "list",
                    name: "continue",
                    message: "Return to Menu?",
                    choices: [
                        "YES",
                        "NO"
                    ]
                })
                .then(function (answer) {
                    if (answer.continue === "YES") {
                        managerMenu();
                    } else if (answer.continue === "NO") {
                        connection.end();
                    }
                })
        }, 1000);
    })
}

function addToInventory() {
    //-------------display inventory
    console.log(chalk.bgBlue("\n=======================Available Products For Sale========================\n"));

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //load products w/console.table
        console.table(res);
    });
    setTimeout(() => {

        inquirer
            .prompt({
                type: "input",
                name: "addToID",
                message: "Please enter the Item ID: ",
                validate: function (value) {
                    if (value) {
                        return true;
                    }
                    return false;
                }
            })
            .then(function (answer) {
                connection.query("SELECT ITEM_ID, PRODUCT_NAME, DEPARTMENT_NAME, PRICE, STOCK_QUANTITY FROM products WHERE ?", {
                    ITEM_ID: answer.addToID
                }, function (err, res) {
                    if (err) throw err;
                    if (res) {
                        displayItem = (chalk.cyan("Item Id: " + res[0].ITEM_ID + " | " + "Product: " + res[0].PRODUCT_NAME + " | " + " Price: " + res[0].PRICE));
                        continueAdd(displayItem);
                    }
                })
            })
    }, 1000);
}

function continueAdd(displayItem) {
    console.log(chalk.yellow("\nYou have selected: " + displayItem + "\n"));

    inquirer
        .prompt({
            type: "list",
            name: "confirm",
            message: "Is This Correct?",
            choices: [
                "YES",
                "NO"
            ]
        })
        .then(function (answer) {
            if (answer.confirm === "YES") {
                finalizeAdd(displayItem);
            } else if (answer.confirm === "NO") {

                console.log(chalk.yellow("\n===================REDIRECTING======================="));
                setTimeout(() => {
                    addToInventory();
                }, 1000);
            }
        })
}

function finalizeAdd(displayItem) {
    var finalAddProduct = displayItem.split(" ", 3);

    inquirer
        .prompt({
            type: "input",
            name: "quantity",
            message: "Enter Amount to Add to Product: " + displayItem,
            validate: function (value) {
                if (value) {
                    return true;
                }
                return false;
            }
        })
        .then((function (answer) {
            connection.query("UPDATE products SET STOCK_QUANTITY = stock_quantity + ? WHERE ITEM_ID = ?",
                [answer.quantity, finalAddProduct[2]],
                function (err, res) {
                    if (err) throw err;
                    // console.log(res);
                    if (res) {
                        console.log(chalk.yellow("\n====================SUCCESS!======================="));
                        console.log(chalk.yellow("\n====================REDIRECTING======================="));
                        setTimeout(() => {
                            managerMenu();
                        }, 1000);
                    }
                })
        }))
}