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
    displayProducts();
});

function displayProducts() {

}