import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Recipe = sequelize.define("Recipe", {
  cuisine: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
  },
  prep_time: {
    type: DataTypes.INTEGER,
  },
  cook_time: {
    type: DataTypes.INTEGER,
  },
  total_time: {
    type: DataTypes.INTEGER,
  },
  description: {
    type: DataTypes.TEXT,
  },
  nutrients: {
    type: DataTypes.JSON,
  },
  serves: {
    type: DataTypes.STRING,
  },
}, 
{
  tableName: "recipes",
  timestamps: false,
});

export default Recipe;
