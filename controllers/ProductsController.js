import Product from "../models/ProductModel.js";
import {sequelize} from "../db/Db.js";
import Company from "../models/CompanyModel.js";



const getAllProducts = async(req,res) => {
    try{
        const allProducts = await Product.findAll();

        return res.json({err:0, status:"success", message: "Get All Product Success", Products: allProducts});
    }
    catch(err){
        return res.json({err: 1, status:"error", message:"Get all Products controller Error", 
            errors:{field: err.name, message: err.message}
        });
    }
};

const getProductById = async(req,res)=>{
    try{
        const product = await Product.findOne({
            where: {id: req.params.id}
        })

        if(!product){
            return res.status(400).json({err:1, status:"error", message: "Product not found"});
        }

        return res.json({err:0, status:"success", message: "Get Product by ID Success", Products: product});
    }
    catch(err){
        return res.json({err: 1, status:"error", message:"Get Product by ID controller Error", 
            errors:{field: err.name, message: err.message}
        });
    }
};

const addProduct = async(req, res) => {
    const transaction = await sequelize.transaction();
    const {category_id, product_name, product_sku, product_description, available_stock, product_image, product_price } = req.body;

    try {
        const verifyUser = req.user;

        const product = await Product.create({
            company_id: verifyUser.company_id,
            category_id,
            product_name,
            product_sku,
            product_description,
            available_stock,
            product_image,
            product_price,
            createdBy: verifyUser.id,
            updatedBy: verifyUser.id,
        },{userId:verifyUser.id},{transaction});

        await transaction.commit();

        return res.json({
            err: 0,
            status: 'success',
            message: `Product added successfully`,
            product,
            verifyUser
        });
    } catch (err) {
        await transaction.rollback();

        return res.status(400).json({
            err: 1,
            status: 'error',
            message: 'Add Product Controller Error: ',
            errors: {
                field: err.name,
                message: err.message,
            },
        });
    }
};


const updateProductById = async(req,res)=>{
    const transaction = await sequelize.transaction();
    const {category_id, product_name, product_sku, product_description, available_stock, product_image, product_price} = req.body;
    const productId = req.params.id;
    try{
        const verifyUser = req.user;

        const updateProduct = await Product.findOne({
            where: {id: productId},
        });

        
        if(!updateProduct){
            return res.json({ err: 1, status: 'error', message: 'Product not found', verifyUser, updateProduct });
        }
        
        
        if (verifyUser.company_id !== updateProduct.company_id) {
            return res.json({ err: 1, status: 'error', message: 'Invalid Company_id or Unauthorized to Update Product.', verifyUser,updateProduct });
        }
        
        
        await updateProduct.update({
            company_id: verifyUser.company_id,
            category_id,
            product_name,
            product_sku,
            product_description,
            available_stock,
            product_image,
            product_price
        },{userId: verifyUser.id},{transaction});

        await transaction.commit();

        return res.json({
            err: 0,
            status: 'success',
            message: `Product Updated successfully`,
            updateProduct,
        });
    }
    catch(err){
        res.json({err: 1, msg: `Update Product Controller Error: `,
            errors: {field: err.name, message: err.message}
        });
    }
};

const deleteProductById = async(req, res) => {
    const productId = req.params.id;
    try{
        const verifyUser = req.user;

        const product = await Product.findOne({
            where: {id: productId}
        })

        if(!product){
            return res.status(400).json({err:1, status:"error", message: "Product not Found"});
        }

        if(verifyUser.company_id !== product.company_id){
            return res.status(401).json({err:1, status:"error", message: "You are unauthorized to delete this product"});
        }

        await product.update({
            deletedBy: verifyUser.id,
        })

        await product.destroy();

        await product.save();

        res.json({err: 0,status:"success", message: `Delete Product Controller Success`});
    }
    catch(err){
        res.json({err: 1,status: "error", message: `Delete Product Controller Error: `,
            errors: {field: err.name, message: err.message}
        });
    }
};

export {getAllProducts, getProductById, addProduct, updateProductById, deleteProductById};