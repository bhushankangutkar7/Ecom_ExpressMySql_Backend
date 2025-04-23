import express from "express";
import {getAllProducts,getAllCompanyProducts, getProductById, addProduct, updateProductById, deleteProductById} from "../controllers/ProductsController.js";
import { validateAddProduct, validateUpdateProduct, validateDeleteProduct} from "../middlewares/validators/ValidateProducts.js";
import {isUser} from "../middlewares/auth/authMiddleware.js";

const productsRouter = express.Router();

productsRouter.get("", getAllProducts);
productsRouter.get("/company", isUser, getAllCompanyProducts);
productsRouter.get("/:id", isUser, getProductById);
productsRouter.post("", isUser, validateAddProduct, addProduct);
productsRouter.put("/:id", isUser, validateUpdateProduct, updateProductById);
productsRouter.delete("/:id", isUser, validateDeleteProduct, deleteProductById);


export default productsRouter;