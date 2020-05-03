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

function productSales() {

    console.log(chalk.yellow("\n=============================Product Sales by Department=========================\n"));
    connection.query(
        "SELECT departmentSales.DEPARTMENT_ID, departmentSales.DEPARTMENT_NAME, departmentSales.OVER_HEAD_COSTS, SUM(departmentSales.PRODUCT_SALES) as PRODUCT_SALES, (SUM(departmentSales.PRODUCT_SALES) - departmentSales.OVER_HEAD_COSTS) as TOTAL_PROFITS FROM(SELECT departments.DEPARTMENT_ID, departments.DEPARTMENT_NAME, departments.OVER_HEAD_COSTS, IFNULL(products.PRODUCT_SALES, 0) as PRODUCT_SALES FROM products RIGHT JOIN departments ON products.DEPARTMENT_NAME = departments.DEPARTMENT_NAME) as departmentSales GROUP BY DEPARTMENT_ID ",
        function (err, res) {
            if (err) throw err;
            //loads departments table;
            if (res) {
                console.table(res);
            }

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
        });
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
                        supervisorMenu();

                    }
                })
        })
}