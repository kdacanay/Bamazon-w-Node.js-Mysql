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
                addInventory();
            } else if (answer.select === "ADD NEW PRODUCT") {
                addProduct();
            } else {
                connection.end();
            }
        })
}

function productView() {

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
                message: "Return to Previous Menu?",
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