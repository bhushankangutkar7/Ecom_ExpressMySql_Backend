import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import Company from "../models/CompanyModel.js";
import AuthenticationError from "../utils/error/AuthenticationError.js";
import { configDotenv } from "dotenv";


configDotenv({
    path: "../.env"
});


const loginController = async(req,res)=>{
    const {email_id, password} = req.body;

    console.log(req.body);

    try{
        const user = await User.findOne({
            where: {email_id: email_id},
        })

        const company = await Company.findOne({
            where: {id: user.company_id}
        })
        
        if(!user){
            throw new AuthenticationError(`User not found`, 404);
        }
        
        
        const dbPassword = user.password;

        const isMatch = await bcrypt.compare(password, dbPassword);
        
        // Needed
        if(!isMatch){
            throw new AuthenticationError(`Invalid Username or password`, 401);
        }       
        // Needed

        
        const payload = {
            user_id: user.id,
            role_id: user.role_id,
            company_id: user.company_id,
            company_name: company.company_name,
        }
        

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "30m"});
        

        return res.json({status: "Success", message: "Login Successful", authToken: token})


    }
    catch(err){
        if(err instanceof AuthenticationError){
            res.json({status: "error", message:"AuthenticationError",
                errors: {field: err.name, error: err.message}
            })
        }

        res.json({status: 'error', message: "Something Went Wrong", errors: {field: err.name, error: err.message}});
    }
}

export default loginController;
