# Software-Engineering-Project

## Local setup
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
5. Run `npm install` to install Node.js dependencies

## Development
1. Run `npm run serve-angular` to start the Angular development server
2. Run `npm run start-debug` to start the Node.js server in debug mode; this will automatically proxy `/` to the Angular development server
3. Open [http://localhost:3000](http://localhost:3000) in your web browser

## Productive execution
1. Run `npm run build` to build the application
2. Start the application with `npm run start-prod`