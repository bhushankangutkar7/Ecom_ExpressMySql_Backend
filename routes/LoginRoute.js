import express from "express";
import validateLogin from "../middlewares/validators/ValidateLogin.js";
import loginController from "../controllers/LoginController.js";


const loginRouter = express.Router();

loginRouter.post("", validateLogin, loginController);

export default loginRouter;