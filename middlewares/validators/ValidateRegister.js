import * as Yup from "yup";


const registerSchema = Yup.object({
    company_name: Yup.string()
    .required("Company name is required"),  
  company_address: Yup.string()
    .required("Company Address is required"),
  company_pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode should be a number and must be exactly 6 digits")
    .required("Pincode is required"),
});

const validateRegister = async(req,res,next) => {
    const {company_name, company_address, company_pincode} = req.body;

    try{
        await registerSchema.validate({company_name, company_address, company_pincode}, {abortEarly: false})
        console.log(`Register Validation Success`);
        next();
    }
    catch(err){
        console.log(err.errors);

        err.errors.forEach(error => {
            console.log(`Validation error: ${error}`);
        });


        res.json({err:1, msg: `Validate Register Error: ${err.errors}`});
    }
};


export default validateRegister;