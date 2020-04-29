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
    //----inquirer customer of id and check inventory-------//
    //-----if available run quantity function-------//
    inquirer
        .prompt({
            type: "input",
            name: "id",
            message: "What is the ID of the product you wish to purchase?",
            validate: function (value) {
                if (value) {
                    return true;
                }
                return false;
            }
        })
        .then(function (answer) {
            var purchaseID = answer.id;
            // var quantity = checkAvailability(purchaseID, checkStock);
            //---check if product availability is true or false
            if (purchaseID) {
                promptQuantity(purchaseID);
            } else {
                //-----inform customer if product is unavailable-----//
                console.log("\nWe're Sorry. Product is Not in Stock At This Time. Please Try Again.");
                customerInquirer();
            }
        })
}

function promptQuantity(purchaseID) {
    //----inquirer customer for amount requested----------------//
    inquirer
        .prompt({
            type: "input",
            name: "amount",
            message: "How many would you like to purchase?",
            validate: function (value) {
                if (value) {
                    return true;
                }
                return false;
            }
        })
        .then(function (answer) {
            var amountRequested = answer.amount;
            //----------check if there is enough product instock----------------//
            if (amountRequested > purchaseID.stock_quantity) {
                console.log("\nWe're Sorry. There is Not Enough in Stock. Please Try Again.");
                displayProducts();
            } else {
                finalizePurchase(purchaseID, amountRequested);
            }
        })
}

function finalizePurchase(id, amountRequested) {
    console.log("CHECK CHECK" + id + amountRequested);
    connection.query("SELECT * FROM Products WHERE item_id = " + id, function (err, data) {
        if (err) throw err;
        console.log(data);
    })
}