import Yup from "yup";

const {object, string, number} = Yup;

const productsSchema = object({
    category_id: Yup.number()
        .integer('Please enter a valid Category Id')
        .positive('Please enter a valid Category Id')
        .required('Category Id is required'),
    product_name: Yup.string()
        .min(3, 'Product name should at least have 4 characters')
        .max(100, 'Product name should not exceed 100 characters')
        .required('Product name is required'),
    product_sku: Yup.string()
        .min(2, 'Product sku should at least have 2 characters')
        .max(30, 'Product sku should not exceed 30 characters')
        .required('Product sku is required'),
    product_description: Yup.string()
        .min(10, 'Product description should at least have 10 characters')
        .max(255, 'Product description should not exceed 255 characters'),
    available_stock: Yup.number()
        .integer('Please enter a valid Available Stock')
        .positive('Please enter a valid Available Stock')
        .required('Available stock is required'),
    product_image: Yup.mixed()
        .required('Product image is required'),
    product_price: Yup.number()
        .integer('Please enter a valid Product Price')
        .positive('Please enter a valid Product Price')
        .required('Product price is required'),
});


const validateGetProductById = async(req,res,next) => {
    if(!req.params.id){
        return res.json({err: 1, msg: `Missing Product ID`});
    }

    try{
        console.log(`Validate Get Product by ID Success`);
        next();
    }
    catch(err){
        console.log(err.errors);

        err.errors.forEach((error)=>console.log(`Validate Get Product By ID Error: ${error}`));

        res.json({err: 1, msg: `Validate Get Product by ID Error: ${err.errors}`})
    }
};

const validateAddProduct = async(req,res,next) => {
    const {category_id, product_name, product_sku, product_description, available_stock, product_image, product_price} = req.body;

    try{
        await productsSchema.validate({category_id, product_name, product_sku, product_description, available_stock, product_image, product_price},{abortEarly: false});
        console.log(`Validate Add Product Success`);
        next();
    }
    catch(err){
        err.errors.forEach((error)=>console.log(`Validate Add Product Error: ${error}\n`));
        res.json({err: 1, msg:`Validate Add Product Erros: ${err.errors}`});
    }
};

const validateUpdateProduct = async(req,res,next) => {
    const {category_id, product_name, product_sku, product_description, available_stock, product_image, product_price} = req.body;

    if(!req.params.id){
        return res.json({err: 1, msg: `Missing Product ID`});
    }

    try{
        await productsSchema.validate({category_id, product_name, product_sku, product_description, available_stock, product_image, product_price},{abortEarly: false});
        console.log(`Validate Update Product Success`);
        next();
    }
    catch(err){
        err.errors.forEach((error)=> console.log(`Validate Update Product Error: ${error}\n`));
        res.json({err:1, msg:`Validate Update Product Error: ${err.errors}`});
    };
};

const validateDeleteProduct = async(req,res,next) => {
    if(!req.params.id){
        return res.json({err:1, msg:`Missing Product ID`});
    }

    try{
        console.log(`Validate Delete Product Success`);
        next();
    }
    catch(err){
        err.errors.forEach((error)=>console.log(`Validate Delete Product by ID Error: ${err.errors}`));
        res.json({err:1, msg:`Validate Delete Product by ID Error: ${err.errors}`});
    };
};


export {validateGetProductById, validateAddProduct, validateUpdateProduct, validateDeleteProduct};