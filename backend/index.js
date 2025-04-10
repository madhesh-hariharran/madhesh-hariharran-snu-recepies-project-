import express from "express";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipeRoutes.js";
import sequelize from "./db.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/api", recipeRoutes);

sequelize.authenticate()
  .then(() => console.log("MySQL DB connected."))
  .catch((err) => console.error("DB connection failed:", err));

app.listen(PORT, () => {
    console.log("Listening in port: "+ PORT);
});