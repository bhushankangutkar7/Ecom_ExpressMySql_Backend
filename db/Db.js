import { Sequelize } from "sequelize";
import { configDotenv } from "dotenv";




configDotenv({
    path: "./.env",
})

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);


const dbConnect = async() => {
    try{
        await sequelize.authenticate();
        console.log(`MySQL DB Authenticated`);
    }
    catch(err){
        console.log(`MySQL Authentication Error: ${err}`);
    }
};


export {sequelize, dbConnect};