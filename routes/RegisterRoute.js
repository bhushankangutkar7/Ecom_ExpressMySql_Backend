import epxress from "express";
import validateRegister from "../middlewares/validators/ValidateRegister.js";
import registerController from "../controllers/RegisterController.js";
import { validateAddUser } from "../middlewares/validators/ValidateUsers.js";

const registerRouter = epxress.Router();

registerRouter.post("",validateRegister, validateAddUser, registerController);


export default registerRouter;