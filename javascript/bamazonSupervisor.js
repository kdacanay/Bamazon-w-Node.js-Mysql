var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require('chalk');
var Table = require("cli-table");

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

function deptTable() {

    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        //loads departments table;
        // console.log(res);
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Cost', 'Total Sales', 'Total Profit'],
            style: {
                head: ['yellow'],
                compact: false,
                colAligns: ['center'],
            }
        });
        console.log(" ");
        console.log(chalk.yellow("=============================Product Sales by Department========================="));

        connection.query('SELECT * FROM departments', function (err, res) {
            if (err) throw err;

            //this loops through the data pulled from the totalprofits database and pushes it into the table above
            for (var i = 0; i < res.length; i++) {
                table.push(
                    [res[i].DEPARTMENT_ID, res[i].DEPARTMENT_NAME, res[i].OVER_HEAD_COSTS]);
            }

            console.log(" ");
            console.log(table.toString());
        })
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

function createDept() {
    //prompt user to create department
    inquirer
        .prompt([{
                type: "input",
                name: "name",
                message: "Please Enter New Department Name: "
            },
            {
                type: "input",
                name: "overHead",
                message: "Please Enter the Overhead Cost of New Department: ",
                validate: function (value) {
                    return value > 0;
                }
            }
        ])
        .then(function (answer) {
            //query new department table
            connection.query("INSERT INTO departments (DEPARTMENT_NAME, OVER_HEAD_COSTS) VALUES (?,?)",
                [answer.name, answer.overHead],
                function (err, res) {
                    if (err) throw err;
                    if (res) {
                        console.log(chalk.yellow("\n=================SUCCESSFULLY ADDED DEPARTMENT=====================\n"));
                        deptTable();

                    }
                })
        })
}