const pg = require('pg');
const connectionString = process.env.DATABASE_URL || `postgres://${config.postgres.user}:${config.postgres.password}@localhost:5432/testdb`;
const client = new pg.Client(connectionString);
client.connect();
/* const query = client.query(
  'CREATE TABLE mytest(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)'); */
const query = client.query(
  `INSERT INTO users VALUES ('Max', 'Mustermann')`);
query.on('end', () => { client.end(); });