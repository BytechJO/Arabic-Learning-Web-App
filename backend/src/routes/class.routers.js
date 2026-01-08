const express = require("express");

const {
  createNewClass,
  getAllClasses,
  getClassById,
  updateClassName,
  deleteClass,
  getClassByTeacherId
} = require("../controllers/class.controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const classRouter = express.Router();

classRouter.post(
  "/createNewClass",
  authentication,
  authorization("create-class"),
  createNewClass
);
classRouter.get(
  "/getAllClass",
  authentication,
  authorization("getAll-class"),
  getAllClasses
);
classRouter.get("/getClassById/:id", authentication, getClassById);
classRouter.put("/updateClassName/:id", authentication, updateClassName);
classRouter.delete("/deleteClass/:id", authentication, deleteClass);
classRouter.get("/getClassByTeacherId", authentication, getClassByTeacherId);

module.exports = classRouter;
