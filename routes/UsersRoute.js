import express from "express";
import { validateAddUser, validateUpdateUser, validateDeleteUser} from "../middlewares/validators/ValidateUsers.js";
import {getAllUsers, getUserById, addUser,  updateUserById, deleteUserById} from "../controllers/UsersController.js";
import {isUser, isAdmin} from "../middlewares/auth/authMiddleware.js";

const usersRouter = express.Router();

usersRouter.get("",isAdmin, getAllUsers);
usersRouter.get("/:id", isAdmin, getUserById);
usersRouter.post("", isAdmin, validateAddUser, addUser);
usersRouter.put("/:id", isAdmin, validateUpdateUser, updateUserById);
usersRouter.delete(`/:id`, isAdmin, validateDeleteUser, deleteUserById);


export default usersRouter;