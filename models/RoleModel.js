import {sequelize} from "../db/Db.js";
import {DataTypes} from "sequelize";

const Role = sequelize.define(
    "role",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: {
            type: DataTypes.STRING,
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
        deleteBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,

        },
    },
    {
        timestamps: true,
        createdAt:"createdAt",
        updatedAt:"updatedAt",
        paranoid: true,
        underscored: true,
    }
);

Role.addHook("beforeCreate", (user, options)=>{
    if(options.userId){
        user.createdBy = options.userId;
    }
});

Role.addHook("beforeUpdate", (user, options)=>{
    if(options.userId){
        user.updatedBy = options.userId;
    }
});

Role.addHook("beforeDestroy", (user, options)=>{
    if(options.userId){
        user.deleteBy = options.userId;
    }
});

const roleTableSync = async() => {
    try{
        await Role.sync({alter: true});
        console.log(`Role table altered or Synced`);
    }
    catch(err){
        console.error(`Role table sync Error: ${err}`);
    }
};

roleTableSync();

export default Role;