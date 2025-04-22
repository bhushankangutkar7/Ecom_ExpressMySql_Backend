import express from "express";
import { uploadImage, getImage} from "../controllers/productImageController.js";
import multer from "multer";
import { isUser, verifyToken } from "../middlewares/auth/authMiddleware.js";
import path from "path";
import { fileURLToPath } from 'url';

// Derive __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productImageRoute = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Store images in the 'uploads' directory
      cb(null, path.resolve(`uploads/2025_04/`));
    },
    filename: (req, file, cb) => {
      // Generate a unique filename (timestamp + original file extension)
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


productImageRoute.post('/uploads', isUser, upload.single('image'), uploadImage);


export default productImageRoute;