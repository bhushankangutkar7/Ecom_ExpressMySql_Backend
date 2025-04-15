import express from "express";
import { verifyToken } from "../middlewares/auth/authMiddleware.js";

const verifyTokenRoute = express.Router();

verifyTokenRoute.get("",verifyToken);

export default verifyTokenRoute;