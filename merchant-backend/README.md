1. BIPI's assignment
   Meant for interview purpose

2. Technology Stack in used
   Node.js, Express.js, GraphQL, Knex.js, PostgreSQL
   .
3. Table of Contents (Optional)
   If your README is very long, you might want to add a table of contents to make it easy for users to navigate to different sections easily. It will make it easier for readers to move around the project with ease.

4. How to Install and Run the Project

   1. Create postgresSql server with these attributes
      host: 'localhost',
      port : 5432,
      user: 'postgres',
      password: 'password',
      database: 'merchant_db'

   2. Create table
      Execute 'db-initial.sql' file under this root directory

   3. Install dependencies
      npm install

   4. Run the project
      node index.js
      
   5. Download and install Postman (if you haven't already).
      Import the 'BIPi-Merchants.postman_collection.json' file under this root directory into postman

5. How to Use the Project
   Execute one of the api in the postman by clicking the 'Send' button located right top after imported the 'BIPi-Merchants.postman_collection.json'.

6. Author : Andy Chai Wei Chuen , andychai.1994@gmail.com
