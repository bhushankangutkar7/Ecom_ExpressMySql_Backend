import User from "../models/UserModel.js";
import {sequelize} from "../db/Db.js";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";

configDotenv({
    path: "../.env,"
})

const getAllUsers = async(req,res)=>{
    try{
        const verifyAdmin = req.user;

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const offset = (page - 1) * limit;
        
        const users = await User.findAll({
                where: {company_id: verifyAdmin.company_id},
                offset,
                limit
        })

        const total = await User.count({
            where: { company_id: verifyAdmin.company_id }
        });

        return res.status(200).json({
            err:0, 
            status: "success",
            message: "Get All Users Success", 
            Users: users,
            pagination: {
                total,
                page,
                limit: limit,
                hasMore: offset + users.legnth < total
            }
        });
    }
    catch(err){
        res.status(400).json({
            err: 1, 
            status: "error" , 
            message: "Get All User Controller Error", 
            errors:{field: err.name, message: err.message}});
    }
};

const getUserById = async(req,res)=>{

    const userId = req.params.id;
    try{
        const verifyAdmin = req.user;

        const user = await User.findOne({
            where: {id: userId}
        })


        if(!user){
            return res.status(401).json({err: 1, status: "error", message: "User not found"});
        }
        
        
        if(!(user.company_id === verifyAdmin.company_id)){
            return res.status(401).json({err: 1, status: "error", message: "Your are unauthorized"});
        }


        return res.status(200).json({err: 0, status:"success", User: user});
    }
    catch(err){
        res.status(400).json({err:1, status:"error", message: "Get User by Id Controller Error", 
            errors:{field: err.name, message: err.message}
        });
    }
};

const addUser = async(req,res)=>{
    const transaction = await sequelize.transaction();
    const {role_id, first_name, last_name, email_id, password, created_by} = req.body;

    try{
        const verifyAdmin = req.user;

        const checkUser = await User.findOne({
            where: {email_id: email_id}
        })

        if(req.role_id === 1){
            return res.json({err: 1, status: "error", message:"Only 1 admin allowed"});
        }

        if(checkUser){
            return res.json({status: "error", message: "Email id is already taken"});
        }

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));


        const user = await User.create({
            company_id: verifyAdmin.company_id,
            role_id: 2,
            first_name: first_name,
            last_name: last_name,
            email_id: email_id,
            password: hashedPassword,
            created_by: verifyAdmin.id,
            updated_by: verifyAdmin.id,
        },{userId: verifyAdmin.id},{transaction});

        await transaction.commit();
        
        return res.json({err: 0, msg: "User Added Sucessfully"});
    }
    catch(err){
        await transaction.rollback();

        return res.status(400).json({
            status: "error",
            message: "Add User Controller Error:",
            errors: {field: err.name, message: err.message}
        })
    }
};

const updateUserById = async(req,res)=>{
    const transaction = await sequelize.transaction();
    const id = req.params.id;
    const {first_name, last_name, email_id, password} = req.body;

    try{
        const [updateUser] = await Promise.all([
            User.findOne({
                where: {id: id},
            })
        ]);

        const verifyAdmin = req.user;


        if(!updateUser){
            return res.json({err:1, message: `User not found`});
        }
        
        
        if(verifyAdmin.company_id !== updateUser.company_id){
            return res.json({err:1, message: `Your are not authorized to update this user`});
        }

        if(updateUser.id === 1){
            return res.json({err: 1, status: "error", message:"Admin can't be updated"});
        }

        
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));   
        

        if(updateUser.first_name !== first_name || updateUser.last_name !== last_name || updateUser.email_id !== email_id || updateUser.password !== hashedPassword){
            await updateUser.update({
                company_id: verifyAdmin.company_id,
                role_id: updateUser.role_id,
                first_name: first_name,
                last_name: last_name,
                email_id: email_id,
                password: hashedPassword,
            }, {userId: verifyAdmin.id}, {transaction});
            
            await transaction.commit();

            return res.json({err: 0, status: "success", msg: `User updated`});
  
        }

        return res.json({err:1,status:"error", message: "No new data provided"});

    }
    catch(err){
        await transaction.rollback();
        res.json({err:1, status: "error", message: `Update User Controller Error:`,errors:{field: err.name, message: err.message}});
    }
};

const deleteUserById = async(req,res)=>{
    const id = req.params.id;

    try{
        const verifyAdmin = req.user;

        const deleteUser = await User.findOne(
            {
                where:{id:id}
            }
        );

        if(!deleteUser){
            return res.json({err: 1, status: "error", message:"User not found"});
        }

        if(verifyAdmin.company_id !== deleteUser.company_id){
            return res.json({err: 1, status: "error", message:"You are not authorized to delete the product"});
        }

        if(deleteUser.role_id === 1){
            return res.json({err: 1, status: "error", message:"Admin can't be deleted"});
        }
        
        await deleteUser.update({
            deletedBy: verifyAdmin.id,
        })

        await deleteUser.save();

        await deleteUser.destroy();

        res.json({err:0, status:"success", message: "Delete User Success"});
    }
    catch(err){
        res.json({err:1, status: "error", message: `Delete User Controller Error:`,errors:{field: err.name, message: err.message}});
    }
};

export {getAllUsers, getUserById, addUser, updateUserById, deleteUserById};