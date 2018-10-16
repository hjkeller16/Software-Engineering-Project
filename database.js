const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://hannah:hannah@localhost:5432/testdb';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE mytest(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });