//NPM PACKAGES

var inquirer = require("inquirer");
var mysql = require("mysql");
require('events').EventEmitter.defaultMaxListeners = 15;

//----------------------------------

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Cd309754321',
    database : 'bamazon'
  });
   
  connection.connect(function(err) {
    if (err) {
      console.error(err);
      return;
    }
   
    console.log('Connected as ID: ' + connection.threadId);
    // Runs function to start the application
    start();
  });


// List a set of menu options:
function start() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            choices: ["View inventory", "View low inventory", "Add to inventory", "Add new product"],
            message: "MANAGER CONSOLE"
        }
    ]).then(function(answer) {
        if(answer.action === "View inventory") {
            viewProducts();
        }
        if(answer.action === "View low inventory") {
            lowInventory();
        }
        if(answer.action === "Add to inventory") {
            addStock();
        }
        if(answer.action === "Add new product") {
            addProduct();
        }
    })
}


//If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) {
            console.log(err)
        }
  
        for (var i = 0; i < results.length; i++) {
          console.log("ID: " + results[i].id);
          console.log("Product: " + results[i].product_name);
          console.log("Department: " + results[i].department_name);
          console.log("Price: " + results[i].price);
          console.log("In Stock: " + results[i].stock);
          console.log("===============================");
        }  
        start();
    })
}

//If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock <= 5", function(err, results) {
        if(err) {
            console.log(err);
        }
        console.log("worked");
        for(var i = 0; i < results.length; i++) {
            console.log("ID: " + results[i].id);
            console.log("Product: " + results[i].product_name);
            console.log("Department: " + results[i].department_name);
            console.log("Price: " + results[i].price);
            console.log("In Stock: " + results[i].stock);
            console.log("===============================");            
            if(results) {
                console.log("All items are stocked.");
                process.on('warning', e => console.warn(e.stack))
                start();
            }
        }

    })
}



//If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addStock() {
    //console.log("ADD TO STOCK");
    inquirer.prompt([
        {
            name: "stockID",
            type: "input",
            message: "What is the ID of the item you want to add stock to?"
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "How many of this item would you like to have in stock?"
        }
    ]).then(function(answer) {
        var ID = answer.stockID;
        var quantity = answer.stockQuantity;
        

        connection.query("UPDATE products SET ? WHERE ?",
        [
            {
               stock: quantity 
            },
            {
                id: ID
            }
        ],
        function(err) {
            if(err) {
                console.log(err);
            }
            console.log("Stock added successfully.");
            start();
        }
        )
    })
}


//Add New Product
//If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.*/

function addProduct() {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What is the name of the product you would like to add?"
        },
        {
            name: "departmentName",
            type: "input",
            message: "What is the name of this products department?"
        },
        {
            name: "productPrice",
            type: "input",
            message: "How much does this product cost?"
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "How many of this product would you like to stock?"
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products SET ?",
        {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.productPrice,
            stock: answer.stockQuantity
        },
        function(err) {
            if(err) {
                console.log(err)
            }
            console.log("New product added succssfully.");
            start();
        })
    })
}