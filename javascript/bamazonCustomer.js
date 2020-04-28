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
    console.log("\n===============================================");
    console.log("\n=============WELCOME TO BAMAZON================");
    console.log("\n===============================================");

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
                console.log("\n===============================================");
                console.log("\nThank You For Shopping With Bamazon!");
                console.log("\n===============================================");

                connection.end();
            }
        })
}

function displayProducts() {

    console.log("\n===============================================");
    console.log("\n==========Today's Available Products===========");
    console.log("\n===============================================");

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
    //----inquirer customer of id and quantity-------//
    inquirer
        .prompt({
            type: "input",
            name: "id",
            message: "What is the ID of the product you wish to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        })
        .then(function (answer) {
            var purchaseID = answer.id;

        })
}