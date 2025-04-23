import jwt from "jsonwebtoken";
import AuthenticationError from "../../utils/error/AuthenticationError.js";
import AuthorizationError from "../../utils/error/AuthorizationError.js";
import User from "../../models/UserModel.js";
import {Op} from "sequelize";
// import { configDotenv } from "dotenv";

// configDotenv({
//     path: "../../.env"
// })


const verifyToken = async(req,res) => {
    try{
        const header = req.header(`Authorization`);
        if(!header){
            throw new AuthenticationError(`Authorization Header is Missing`);
        }
        const token = header.split("Bearer ")[1];
        if(!token){
            throw new AuthenticationError(`Token is not Provided`);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
                throw new AuthenticationError(`Invalid Token`);
            }

            req.user = decoded;
            if(req.user){
                return res.status(200).json({err: 0, message: `Verification Success`});
            }
        });
    }
    catch(err){
        if(err instanceof AuthenticationError){
            return res.status(401).json({status: "error", message: "Authentication Error",
                errors: {field: err.name, message: err.message}
            });
        }

        return res.status(500).json({status: "error", message:`Something went wrong`, errors: {filed: err.name, message:err.message}});
        
    }
};


const isUser = async(req, res, next) => {
    try {
        const header = req?.header('Authorization');
        if (!header) {
            throw new AuthenticationError('Authorization Header is Missing');
        }

        const token = header?.split('Bearer ')[1];

        if (!token) {Authorization
            throw new AuthenticationError('Token is not Provided');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const verifyUser = await User.findOne({where:{id: decodedToken.user_id}});

        if (!verifyUser) {
            throw new AuthenticationError('User not found');
        }


        req.decodedToken = decodedToken;
        req.user = verifyUser;
        next(); 
    } catch (err) {
        if (err instanceof AuthenticationError) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication Error',
                errors: { field: err.name, message: err.message }
            });
        }

        return res.status(500).json({
            status: 'error',
            message: `Something went wrong`,
            errors: { field: err.name, message: err.message }
        });
    }
};


const isAdmin = async(req, res, next) => {
    
    try{
        const header = req.header(`Authorization`);
            if(!header){
                throw new AuthenticationError(`Authorization Header is Missing`);
            }

            const token = header.split(`Bearer `)[1];

            if(!token){
                throw new AuthenticationError(`Token is not Provided`);
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            
            const verifyAdmin = await User.findOne({where:{id: decodedToken.user_id}});

            if(!verifyAdmin.id){
                throw new AuthenticationError(`Admin not found`);
            }

            if(verifyAdmin.role_id !== 1){
                throw new AuthorizationError("Unathorized Access. Route is procted for Admin only");
            }

            req.decodedToken = decodedToken;
            req.user = verifyAdmin;
            next();
            
    }
    catch(err){
        if(err instanceof AuthenticationError){

            return res.status(401).json({status: "error", message: "Authentication Error",
                errors: {field: err.name, message: err.message}
            });
        }

        if(err instanceof AuthorizationError){
            return res.status(403).json({status: "error", message: "Authorization Error",
                errors: {field: err.name, message: err.message}
            });
        }

        return res.status(500).json({status: "error", message:`Something went wrong`, errors: {filed: err.name, message:err.message}});
    }
};


export {isUser, isAdmin, verifyToken};