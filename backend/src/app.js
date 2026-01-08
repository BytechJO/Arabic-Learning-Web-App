const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./models/db");

// routes
const usersRouter = require("./routes/user.routers");
const rolesRouter = require("./routes/roles.routers");
const classRouter = require("./routes/class.routers");

const app = express();

app.use(cors());
app.use(express.json());

// router middleware

app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/class", classRouter);

// Handles any other endpoints [unassigned - endpoints]
app.use(" ", (req, res) => {
  res.status(404).json("NO content at this path");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
