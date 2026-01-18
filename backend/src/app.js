const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./models/db");
require("./models/activationDB")
// routes
const usersRouter = require("./routes/user.routers");
const rolesRouter = require("./routes/roles.routers");
const classRouter = require("./routes/class.routers");
const letterRouter = require("./routes/letter.routers");
const lessonRouter = require("./routes/lesson.routers");
const progressRouter = require("./routes/progress.routers");
const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("*", cors());


// router middleware
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/class", classRouter);
app.use("/letters", letterRouter);
app.use("/lessons", lessonRouter);
app.use("/progress", progressRouter);

// Handles any other endpoints [unassigned - endpoints]
app.use((req, res) => {
  res.status(404).json("NO content at this path");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
