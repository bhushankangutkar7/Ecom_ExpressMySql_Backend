import express from "express";
import {validateGetUserById, validateAddUser, validateUpdateUser, validateDeleteUser} from "../middlewares/validators/ValidateUsers.js";
import {getAllUsers, getUserById, addUser,  updateUserById, deleteUserById} from "../controllers/UsersController.js";
import {isUser, isAdmin} from "../middlewares/auth/authMiddleware.js";

const usersRouter = express.Router();

//No validation is required for this Request.

usersRouter.get("",isAdmin, getAllUsers);
usersRouter.get("/:id", isAdmin,validateGetUserById, getUserById);
usersRouter.post("", isAdmin, validateAddUser, addUser);
usersRouter.put("/:id", isAdmin, validateUpdateUser, updateUserById);
usersRouter.delete(`/:id`, isAdmin, validateDeleteUser, deleteUserById);

// usersRouter.get("/:id", validateGetUserById, getUserById);
// usersRouter.post("", validateAddUser, addUser);
// usersRouter.put("/:id", validateUpdateUser, updateUserById);
// usersRouter.delete(`/:id`, validateDeleteUser, deleteUserById);

export default usersRouter;