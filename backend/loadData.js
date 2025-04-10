import fs from "fs";
import path from "path";
import Recipe from "./models/recipeModel.js";
import sequelize from "./db.js";

const filePath = path.resolve("./data/US_recipes_null.json");
const fileContents = fs.readFileSync(filePath, "utf-8");
let jsonData = JSON.parse(fileContents);

jsonData = Object.values(jsonData);

const loadRecipes = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("DB connected and table created.");

    const recipes = jsonData.map(r => ({
      cuisine: r.cuisine,
      title: r.title,
      rating: r.rating,
      prep_time: r.prep_time,
      cook_time: r.cook_time,
      total_time: r.total_time,
      description: r.description,
      nutrients: r.nutrients,
      serves: r.serves,
    }));

    await Recipe.bulkCreate(recipes);
    console.log("Recipes inserted successfully.");
  } catch (err) {
    console.log("Error in loadData:", err);
  } finally {
    await sequelize.close();
  }
};

loadRecipes();
