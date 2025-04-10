import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    "database", //your database name
    "user",     //your user
    "password", //your password
    {
        host: "localhost",
        dialect: "mysql",
    }
);

export default sequelize;