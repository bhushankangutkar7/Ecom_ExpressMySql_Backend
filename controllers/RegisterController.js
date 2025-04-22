import { Op } from "sequelize";
import User from "../models/UserModel.js";
import Company from "../models/CompanyModel.js";
import bcrypt from "bcryptjs";
import {sequelize} from "../db/Db.js"; // Import your sequelize instance here

const registerController = async (req, res) => {
    const { company_name, company_address, company_pincode, first_name, last_name, email_id, role_id, password } = req.body;

    const transaction = await sequelize.transaction(); // Initialize transaction

    try {
        // Check if the company or user already exists
        const [checkCompany, checkUser] = await Promise.all([
            Company.findOne({ where: { company_name } }),
            User.findOne({ where: { email_id } })
        ]);

        if (checkCompany) {
            throw new Error("Company Name already exists");
        }
        if (checkUser) {
            throw new Error("User with this Email Id already exists");
        }

        
        const company = await Company.create({
            company_name,
            company_address,
            company_pincode,
        }, { transaction });

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        const user = await User.create({
            company_id: company.id,
            role_id: 1,
            first_name,
            last_name,
            email_id,
            password: hashedPassword,
        }, { transaction });


        await Promise.all([
            company.update({
                createdBy: user.id,
                updatedBy: user.id
            }, { transaction }),

            user.update({
                createdBy: user.id,
                updatedBy: user.id
            }, { transaction })
        ]);


        await transaction.commit();

        return res.json({ err: 0, msg: "Registration Successful" });

    } catch (err) {

        await transaction.rollback();
        
        return res.status(400).json({
            status: "error",
            message: `Registration failed`,
            errors: { field: err.name, message: err.message }
        });
    }
};

export default registerController;
