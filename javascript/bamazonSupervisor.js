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

    supervisorMenu();
});

function supervisorMenu() {
    //prompt supervisr
    inquirer
        .prompt({
            type: "list",
            name: "select",
            message: "Please Make a Selection: ",
            choices: [
                "VIEW DAILY INVENTORY",
                "VIEW PRODUCT SALES BY DEPARTMENT",
                "CREATE NEW DEPARTMENT",
                "EXIT"
            ]
        })
        .then(function (answer) {
            if (answer.select === "VIEW DAILY INVENTORY") {
                productView();
            } else if (answer.select === "VIEW PRODUCT SALES BY DEPARTMENT") {
                productSales();
            } else if (answer.select === "CREATE NEW DEPARTMENT") {
                createDept();
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
                    supervisorMenu();
                } else if (answer.continue === "NO") {
                    connection.end();
                }
            })
    }, 1000);
}