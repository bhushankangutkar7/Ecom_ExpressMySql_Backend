import { Op } from "sequelize";
import User from "../models/UserModel.js";
import Company from "../models/CompanyModel.js";
import bcrypt from "bcryptjs";

const registerController = async (req, res) => {
    const { company_name, company_address, company_pincode, first_name, last_name, email_id, role_id, password } = req.body;

    try {
        const checkCompany = await Company.findOne({
            where: { company_name: company_name }
        });

        if (checkCompany) {
            // return res.json({ status: "error", message: "Company Name already exists" });
            throw new Error("Company Name already exists" );
        }

        const checkUser = await User.findOne({
            where: { email_id: email_id }
        });

        if (checkUser) {
            // return res.json({ status: "error", message: "User with this Email Id already exists" });
            throw new Error("User with this Email Id already exists");
        }

        const salt = bcrypt.genSaltSync(15);

        // Create company
        const company = await Company.create({
            company_name: company_name,
            company_address: company_address,
            company_pincode: company_pincode,
        });

        await company.save();

        // Fetch the created company again
        const updateCompany = await Company.findOne({
            where: { company_name: company_name }
        });

        if (!updateCompany) {
            // return res.status(400).json({ status: "error", message: "Company not found after creation." });
            throw new Error("Company not found after creation.");
        }

        const user = await User.create({
            company_id: updateCompany.id,
            role_id: 1,
            first_name: first_name,
            last_name: last_name,
            email_id: email_id,
            password: bcrypt.hashSync(password, salt)
        });
        await user.save();

        console.log('User ID', user.id);

        // Fetch the created user
        const updateUser = await User.findOne({
            [Op.and]: [
                { company_id: updateCompany.id },
                { first_name: first_name }
            ]
        });

        if (!updateUser) {
            // return res.status(400).json({ status: "error", message: "User not found after creation." });
            throw new Error("User not found after creation.");
        }

        updateUser.set({
            createdBy: updateUser.id,
            updatedBy: updateUser.id,
        });

        await updateUser.save();

        updateCompany.set({
            createdBy: updateUser.id,
            updatedBy: updateUser.id,
        });

        await updateCompany.save();

        // Final check if user is successfully inserted
        const checkUserInserted = await User.findOne({
            [Op.and]: [
                { company_id: updateCompany.id },
                { first_name: first_name }
            ]
        });

        if (checkUserInserted === null) {
            await Company.destroy({
                where: { company_name: company_name }
            });

            // return res.json({ err: 1, message: "Try Company deleted due to failure in Admin registration. Please Register Company again." });
            throw new Error("Try Company deleted due to failure in Admin registration. Please Register Company again.");
        }

        return res.json({ err: 0, msg: "Register Successful" });

    } catch (err) {
        // Handling errors in the catch block
        const checkCompany1 = await Company.findOne({
            where: { company_name: company_name }
        });

        if (checkCompany1) {
            const checkUser1 = await User.findOne({
                [Op.and]: [
                    { company_id: checkCompany1.id },
                    { first_name: first_name }
                ]
            });

            if (checkUser1 === null) {
                await Company.destroy({
                    where: { company_name: company_name }
                });
                // return res.json({ err: 1, message: "Catch Company deleted due to failure in Admin registration. Please Register Company again." });
                throw new Error("Catch Company deleted due to failure in Admin registration. Please Register Company again.");
            }
        }

        return res.json({ status: "error", message: `Register controller error`, errors: { field: err.name, message: err.message } });
    }
};

export default registerController;
