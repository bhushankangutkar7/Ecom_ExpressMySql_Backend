import Yup, { ValidationError } from "yup";

const {object,string,number, date, inferType} = Yup;

const loginSchema = object({
    email_id: string()
        .min(10,"Email Id atleast 10 characters long")
        .max(100,`Email Id should not exceed 100 characters`)
        .matches(/[@]/,`Email Id must contain "@" symbol`)
        .matches(/[.]/,`Email Id must have "."`),
    password : string()
        .min(8, "Password must contain atleast 8 characters")
        .max(16, "Password cannot exceed 16 characters")
        .matches(/[a-z]/, "Password must contain atleast one lowercase")
        .matches(/[A-Z]/, "Password must contain atleast one Uppercase")
        .matches(/[@#$%&*/]/, "Password must contain atleast one special character from (@,#,$,%,&,*,/)")
        .required("Password is required")
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