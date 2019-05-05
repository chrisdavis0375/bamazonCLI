//NPM PACKAGES

var inquirer = require("inquirer");
var mysql = require("mysql");
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
  });


  //Display all products

  connection.query("SELECT * FROM products", function(err, results) {
      if(err) {
          console.log(err)
      }

      for (var i = 0; i < results.length; i++) {
        //console.log(results);
        console.log("ID: " + results[i].id);
        console.log("Product: " + results[i].product_name);
        console.log("Department: " + results[i].department_name);
        console.log("Price: " + results[i].price);
        console.log("In Stock: " + results[i].stock);
        console.log("===============================");
      }
      start();

  })


  //Inquirer prompts
  function start() {
      inquirer
      .prompt([
          {
              name: "id",
              type: "input",
              message: "What is the ID of the product you would like to buy?"
          },
          {
              name: "quantity",
              type: "input",
              message: "How many units would you like to purchase"
          }
      ]).then(function(answer) {
          var id = answer.id;
          var amount = answer.quantity;
          console.log(answer);

          connection.query("SELECT * FROM products", function(err, results) {
              if(err) {
                  console.log(err)
              }
              //console.log(results);
              var chosen;
              for(var i = 0; i < results.length; i++) {
                  if(results[i].id === parseInt(answer.id)) {
                      chosen = results[i];
                  }
              }
              if(chosen.stock > parseInt(answer.quantity)) {
                  connection.query("UPDATE products SET ? WHERE ?", [
                      {
                          stock: (chosen.stock - parseInt(answer.quantity))
                      },
                      {
                          id: chosen.id
                      }
                  ],
                  function(err) {
                      if(err) {
                          console.log(err);
                      }
                      console.log("Thanks for using bamazon! Your total cost is $" + parseInt(answer.quantity) * chosen.price);
                  })
              } else {
                  console.log("Sorry. We don't have enough of the item you have selected in stock. Please choose a different item.");
              }
          })
      })
  };

  //