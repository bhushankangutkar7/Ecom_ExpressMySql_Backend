import express from "express";
import { uploadImage, getImage} from "../controllers/productImageController.js";
import multer from "multer";

const productImageRoute = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Store images in the 'uploads' directory
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      // Generate a unique filename (timestamp + original file extension)
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

// const upload = multer({ storage: storage });
const upload = multer({ dest: 'uploads/' })

productImageRoute.post('/upload', upload.single('image'), uploadImage);

productImageRoute.get('/:filename', getImage);

export default productImageRoute;