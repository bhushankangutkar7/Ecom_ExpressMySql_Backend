import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { configDotenv } from "dotenv";
import loginRouter from "./routes/LoginRoute.js";
import registerRouter from "./routes/RegisterRoute.js";
import usersRouter from "./routes/UsersRoute.js";
import productsRouter from "./routes/ProductsRoute.js";
import productImageRouter from "./routes/productImageRoute.js";
import verifyTokenRouter from "./routes/VerifyTokenRoute.js";
import { dbConnect } from "./db/Db.js";
import cors from "cors";


configDotenv({
    path: "./.env",
})

const PORT  = process.env.PORT;

dbConnect();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));

app.use("/login", loginRouter);
app.use("/verify-token", verifyTokenRouter);
app.use("/register", registerRouter);
app.use("/users", usersRouter);
app.use("/image", productImageRouter);
app.use("/products", productsRouter);
app.listen(PORT, (err)=>{
    if(err){
        console.log(`Server run error: ${err}`)
    }
    
    console.log(`Server is running on ${PORT}`);
})

