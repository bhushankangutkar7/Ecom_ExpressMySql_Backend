import Yup from "yup";

const {object, string, number} = Yup;

const registerSchema = object({
    company_name: string()
        .required("Company name is required"),  
    company_address: string()
        .required("Company Address is required"),
    company_pincode : number()
        .integer("Pincode needs to be an Integer")
        .positive("Pincode can't be Negative")    
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