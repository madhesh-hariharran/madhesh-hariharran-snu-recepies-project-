import express from "express";
import {getRecipes, searchRecipes} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/recipes", getRecipes);
router.get("/recipes/search", searchRecipes); 

export default router;