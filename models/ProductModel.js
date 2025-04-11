import {sequelize} from "../db/Db.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define(
    "product",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_sku: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        available_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deletedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        deletedAt:{
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        paranoid: true,
        underscored: true,
    }
);

Product.addHook("beforeCreate", (user, options) => {
    if(options.userId){
        user.createdBy = options.userId;
    }
});

Product.addHook("beforeUpdate", (user, options) => {
    if(options.userId){
        user.updatedBy = options.userId;
    }
});

Product.addHook("beforeDestroy", (user, options) => {
    if(options.userId){
        user.deletedBy = options.userId;
        user.deletedBy = new Date();
    }
});

const productTableSync = async() => {
    try{
        await Product.sync({alter:true});
        console.log(`Product table altered or Synced`);
    }
    catch(err){
        console.error(`Product table sync Error: ${err}`);
    }
};

productTableSync();

export default Product;