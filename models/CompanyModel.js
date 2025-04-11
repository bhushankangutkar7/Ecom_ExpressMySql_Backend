import { sequelize } from "../db/Db.js";
import { DataTypes } from "sequelize";

const Company = sequelize.define(
    "company",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        company_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_pincode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deletedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        paranoid: true,
        underscored: true,
    }
);

Company.addHook(`beforeCreate`, (user, options)=>{
    if(options.userId){
        user.createdBy = options.userId;
    }
});

Company.addHook(`beforeUpdate`, (user, options)=>{
    if(options.userId){
        user.updatedBy = options.userId;
    }
});

Company.addHook(`beforeDestroy`, (user, options)=>{
    if(options.userId){
        user.deletedBy = options.userId;
        user.deletedAt = new Date();
    }
});


const companyTableSync = async() => {
    try{
        await Company.sync({alter:true});
        console.log(`Company table altered or synced`);
    }
    catch(err){
        console.error(`Company table sync Error ${err}`);
    } 
};

companyTableSync();


export default Company;