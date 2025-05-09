import Product from "../models/ProductModel.js";
import {sequelize} from "../db/Db.js";
import fs from "fs";
import path from "path";


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

const getAllCompanyProducts = async (req, res) => {
    try {
        const verifyUser = req.user;

        // Get page and limit from query parameters (with defaults)
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        // Calculate offset
        const offset = (page - 1) * limit;

        // Fetch paginated products
        const products = await Product.findAll({
            where: { company_id: verifyUser.company_id },
            offset,
            limit
        });

        // Optional: Also return total count if needed
        const total = await Product.count({
            where: { company_id: verifyUser.company_id }
        });

        return res.status(200).json({
            err: 0,
            status: "success",
            message: "Get All Company Products Success",
            Products: products,
            pagination: {
                total,
                page,
                limit,
                hasMore: offset + products.length < total
            }
        });

    } catch (err) {
        res.status(400).json({
            err: 1,
            status: "error",
            message: "Get All Company Products Controller Error",
            errors: { field: err.name, message: err.message }
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

const addProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  const {
    category_id,
    product_name,
    product_sku,
    product_description,
    available_stock,
    product_image, // e.g. "uploads/2025_05/image123.jpg"
    product_price
  } = req.body;

  try {
    const verifyUser = req.user;

    // 1. Prepare file paths
    const originalImagePath = path.join(path.resolve(`uploads/2025_04`,product_image),); // absolute path
    const fileName = originalImagePath.replace(/^.*[\\/]/, '');
    const destinationDir = path.resolve('uploads/products/');
    const newImagePath = path.join('uploads/products', fileName); // relative for DB


    // 2. Ensure destination folder exists
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    // 3. Copy the file
    fs.copyFileSync(originalImagePath, path.resolve(newImagePath));

    // 4. Save to DB
    const product = await Product.create({
      company_id: verifyUser.company_id,
      category_id,
      product_name,
      product_sku,
      product_description,
      available_stock,
      product_image: fileName, // save the new path
      product_price,
      createdBy: verifyUser.id,
      updatedBy: verifyUser.id,
    }, { transaction });

    await transaction.commit();

    return res.json({
      err: 0,
      status: 'success',
      message: `Product added successfully`,
      product,
    });

  } catch (err) {
    await transaction.rollback();

    return res.status(400).json({
      err: 1,
      status: 'error',
      message: 'Add Product Controller Error',
      errors: {
        field: err.name,
        message: err.message,
      },
    });
  }
};



const updateProductById = async(req,res)=>{
    console.log(req.body)
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

        // 1. Prepare file paths
        const originalImagePath = path.join(path.resolve(`uploads/2025_04/`,product_image),); // absolute path
        const fileName = originalImagePath.replace(/^.*[\\/]/, '');
        const destinationDir = path.resolve('uploads/products/');
        const newImagePath = path.join('uploads/products', fileName); // relative for DB


        console.log(originalImagePath)
        console.log(fileName)
        console.log(destinationDir)
        console.log(newImagePath)

        if (!fs.existsSync(originalImagePath)) {
            console.error("SOURCE FILE DOES NOT EXIST:", originalImagePath);
            return res.status(400).json({ err: 1, message: 'Source file not found.' });
        }
        

        // 2. Ensure destination folder exists
        if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
        }

        // 3. Copy the file
        fs.copyFileSync(originalImagePath, path.resolve(newImagePath));
        
        
        await updateProduct.update({
            company_id: verifyUser.company_id,
            category_id,
            product_name,
            product_sku,
            product_description,
            available_stock,
            product_image: fileName,
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

        res.json({err: 0,status:"success", message: `Delete Product ${product.product_name} success`});
    }
    catch(err){
        res.json({err: 1,status: "error", message: `Delete Product Controller Error: `,
            errors: {field: err.name, message: err.message}
        });
    }
};

export {getAllProducts, getAllCompanyProducts, getProductById, addProduct, updateProductById, deleteProductById};