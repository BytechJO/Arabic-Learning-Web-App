const { Pool } = require("pg");

const connectionString = process.env.Activation_DB;
console.log(connectionString);

const ActivationDB = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
ActivationDB.connect()
  .then((res) => {
    console.log(`DB connected to ${res.database}`);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = ActivationDB;
