### Instructions

1. After downloading the rep - you'll have to configure a .env file which takes in the following:
   - DB connection variables for postgres:
     - DB_USER
     - DB_PASS
     - DB_HOST
     - DB_PORT
     - DB_NAME
   - An auth secret phrase for token validation middleware AUTH_SECRET
   - A pinata api key and secret key:
     - PINATA_API_KEY
     - PINATA_API_SECRET
2. Run node server.js to start
3. Test endpoints using postman collection
