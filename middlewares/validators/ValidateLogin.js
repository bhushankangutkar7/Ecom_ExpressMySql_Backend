import Yup, { ValidationError } from "yup";

const loginSchema = Yup.object({
    email_id: Yup.string()
        .min(10,"Email Id must atleast be 10 characters long")
        .max(100,`Email Id should not exceed 100 characters`)
        .matches(/[@]/,`Email Id must contain "@" symbol`)
        .matches(/[.]/,`Email Id must have "."`)
        .email("Invalid Email Id format")
        .required(`Email Id is required`),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must be at most 16 characters")
        .matches(/[a-z]/, "Must include at least one lowercase letter")
        .matches(/[A-Z]/, "Must include at least one uppercase letter")
        .matches(/[@#$%&*/]/, "Must include atleast one special character (@,#,$,%,&,*,/)")
        .required("Password is required"),
})


const validateLogin = async(req, res, next) => {
    const email_id = req.body?.email_id;
    const password = req.body?.password


    try{
        await loginSchema.validate({email_id, password}, {abortEarly: false})
        console.log(`Login Validation Success`);
        next();
    }
    catch(err) {
        if (err instanceof ValidationError) {
            return res.json({status:'error', message: `Validation Error`, errors: err.inner.map(e => ({field: e.path, error: e.message}))});
        } else {
            return res.json({status:'error', message: `Something went wrong`, errors: err.message});
        }
        
    }
};

export default validateLogin;