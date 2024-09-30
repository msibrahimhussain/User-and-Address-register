const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "myDatabase.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    await database.run(
      `CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY, name TEXT)`
    );
    await database.run(
      `CREATE TABLE IF NOT EXISTS Address (id INTEGER PRIMARY KEY, userId INTEGER, address TEXT, FOREIGN KEY (userId) REFERENCES User(id))`
    );

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("register/", async (request, response) => {
  const { name, address } = request.body;
  const postUserQuery = `
  INSERT INTO
    User (name)
  VALUES
    ('${name}');`;
  await database.run(postUserQuery);

  const postAddressQuery = `
  INSERT INTO
    Address (address)
  VALUES
    ('${address}');`;
  await database.run(postAddressQuery);
  response.send("Details added");
});
module.exports = app;
