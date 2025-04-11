import { sequelize } from "../db/Db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
    "user",
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
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull:  false,
        },
        email_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
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


User.addHook(`beforeCreate`, (user, options)=>{
    if(options.userId){
        user.createdBy = options.userId;
    }
});

User.addHook(`beforeUpdate`, (user, options)=> {
    if(options.userId){
        user.updatedBy = options.userId;
    }
});

User.addHook(`beforeDestroy`, (user, options) => {
    if(options.userId) {
        user.deletedBy = options.userId;
        user.deletedAt = new Date();
    }
})

const userTableSync = async() => {
    try{
        await User.sync({alter: true});
        console.log(`User table altered or Synced`);
    }
    catch(err){
        console.error(`User table sync Error: ${err}`);
    }
};

userTableSync();

export default User;