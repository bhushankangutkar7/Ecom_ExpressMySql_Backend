import * as Yup from "yup";

const usersSchema = Yup.object({
    role_id: Yup.number()
        .integer("Please provide a valid Role Id")
        .positive("Please provide a valid Role Id")
        .required("Role Id is required"),
    first_name: Yup.string()
        .min(2,"First name must be alteat Two characters long")
        .max(16, "First name must not exceed 16 characters")
        .required("First Name is required"),
    last_name: Yup.string()
        .min(2,"Last name must be alteat Two characters long")
        .max(16, "Last name must not exceed 16 characters")
        .required("Last Name is required"),
    email_id: Yup.string()
        .min(10,"Email Id atleast 10 characters long")
        .max(100,`Email Id should not exceed 100 characters`)
        .matches(/[@]/,`Email Id must contain "@" symbol`)
        .matches(/[.]/,`Email Id must have "."`)
        .email("Invalid Email Id format")
        .required(`Email Id is required`),
    password : Yup.string()
        .min(8, "Password must contain atleast 8 characters")
        .max(16, "Password cannot exceed 16 characters")
        .matches(/[a-z]/, "Password must contain atleast one lowercase")
        .matches(/[A-Z]/, "Password must contain atleast one Uppercase")
        .matches(/[@#$%&*/]/, "Password must contain atleast one special character from (@,#,$,%,&,*,/)")
        .required("Password is required")
});


const validateGetUserById = async(req,res,next) => {
    if(!req.params.id){
        return res.json({err: 1, msg: "Missing user ID"})
    }

    try{
        console.log(`Validate Get user by ID success`);
        next();
    }
    catch(err){
        console.log(err.errors);

        err.errors.forEach((error)=>{
            console.log(`Validate Get User by ID Error: ${error}`);
        })

        return res.json({err: 1, msg: `Validate Get User by ID Error: ${err.errors}`});
    }
};


const validateAddUser = async(req,res,next) => {
    const {company_id, role_id, first_name, last_name, email_id, password} = req.body;

    try{
        await usersSchema.validate({company_id, role_id, first_name, last_name, email_id, password}, {abortEarly: false})
        console.log(`Validate Add User Success`);
        next();
    }
    catch(err){
        console.log(err.errors);
        console.log(typeof err.errors);
        
        err.errors.forEach(error => {
            console.log(`Validate Add User error: ${error}`);
        });

        return res.json({err:1 , msg:`Validate Add User Error: ${err.errors}`});
    }
};


const validateUpdateUser = async(req,res,next) => {
    const {company_id, role_id, first_name, last_name, email_id, password} = req.body;

    if(!req.params.id){
        return res.json({err: 1, msg: `Missing User Id`});
    }

    try{
        await usersSchema.validate({company_id, role_id, first_name, last_name, email_id, password}, {abortEarly: false})
        console.log(`Validate Update User Success`);
        next();
    }
    catch(err){
        console.log(err);

        err.errors.forEach((error)=>{
            console.log(`Validate Update User Error: ${error}\n`);
        })

        return res.json({err: 1, msg: `Validate Update User Error: ${err.errors}`});
    }
};

const validateDeleteUser = (req,res,next) => {
    if(!req.params.id){
        return res.json({err: 1, msg: `Missing User Id`});
    }

    try{
        console.log(`Validate Delete User Success`);
        next();
    }
    catch(err){
        console.log(err.errors);

        err.errors.forEach((error)=>{
            console.log(`Validate Delete user Error: ${error}`);
        });

        return res.json({err:1, msg:`Validate Delete User Error: ${err.errors}`});
    }
};



export {validateAddUser, validateGetUserById, validateUpdateUser, validateDeleteUser};