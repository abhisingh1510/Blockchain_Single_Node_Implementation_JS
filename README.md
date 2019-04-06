# cryptoapp
Simple blockchain implementation using Node.js 
To run the application:
  1. Open cmd and execute the command "mongod" (Without the quotes) (This starts the mongodb server locally on port 27017)
  2. Open new cmd window and navigate to the app folder
  3. Execute the command "nodemon /bin/www" (Again without the quotes)
  4. Open "http://localhost:3000/" on any browser
 
 *For the database to work you need a database by the name of blockchain (or you can create a different database and change the name in conn.js accordingly)
 *The collection names are also important which in this code are "users" and "chain" (If you want to create your own then change the calls for the same in routes and usermodel.js)
 
