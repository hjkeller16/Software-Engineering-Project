# Software-Engineering-Project

## Local execution
1. Install [PostgreSQL](https://www.postgresql.org)
2. Create a PostgreSQL user (`<user>`) with a password (`<password>`)
    - `createuser <user>`
3. Create a PostgreSQL database (`<database>`)
    - `createdb <database>`
4. Create the file `config.json` with the following content:
    ```json
    {
        "postgres": {
            "host": "localhost",
            "database": "<database>",
            "user": "<user>",
            "password": "<password>"
        }
    }
    ```
4. Run `npm install` to install Node.js dependencies
5. Run `npm start` to start the server
6. Open [http://localhost:3000](http://localhost:3000) in your web browser