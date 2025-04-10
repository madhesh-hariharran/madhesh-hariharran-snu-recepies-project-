import Recipe from "../models/recipeModel.js";
import { Op, Sequelize } from "sequelize";
import sequelize from "../db.js";

export const getRecipes = async (req, res) =>{
  try {
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 10;
    if(page<1 || limit<1){
        page=1;
        limit=10;
        console.log("less than 1 not allowed, thus defaulting");
    }
    const offset = (page-1)*limit;

    const rows  = await Recipe.findAll({offset, limit, order: [['id', 'ASC']]});

    res.status(200).json({
      Page: page,
      Limit: limit,
      recipes: rows,
    });
  } catch (error){
    console.log("Error in getRecipes:"+ error);
    res.status(500).json({message: "my bad"});
  }
};

export const searchRecipes = async (req, res) => {
  try {
    const { title, cuisine, total_time, rating } = req.query;

    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.like]: `%${title.toLowerCase()}%` };
    }

    if (cuisine) {
      whereClause.cuisine = { [Op.like]: `%${cuisine.toLowerCase()}%` };
    }

    if (rating) {
      const match = rating.match(/(<=|>=|=|<|>)([\d.]+)/);
      if (match) {
        const [, op, val] = match;
        whereClause.rating = { [getSequelizeOp(op)]: parseFloat(val) };
      } else {
        return res.status(400).json({ error: "Invalid rating." });
      }
    }

    if (total_time) {
      const match = total_time.match(/(<=|>=|=|<|>)(\d+)/);
      if (match) {
        const [, op, val] = match;
        whereClause.total_time = { [getSequelizeOp(op)]: parseInt(val) };
      } else {
        return res.status(400).json({ error: "Invalid total_time." });
      }
    }

    const rawResults = await Recipe.findAll({
      where: whereClause,
      raw: true,
    });

    const nutrientFilters = {
      calories: req.query.calories,
      fatContent: req.query.fatContent,
      sugarContent: req.query.sugarContent,
      sodiumContent: req.query.sodiumContent,
      proteinContent: req.query.proteinContent,
      cholesterolContent: req.query.cholesterolContent,
      carbohydrateContent: req.query.carbohydrateContent,
      fiberContent: req.query.fiberContent,
      saturatedFatContent: req.query.saturatedFatContent,
      unsaturatedFatContent: req.query.unsaturatedFatContent
    };

    let filteredResults = rawResults.filter((row) => {
      try {
        const nutrients = typeof row.nutrients === "string" ? JSON.parse(row.nutrients) : row.nutrients || {};

        for (const [key, condition] of Object.entries(nutrientFilters)) {
          if (!condition) continue;

          const match = condition.match(/(<=|>=|=|<|>)(\d+)/);
          if (!match) return false;

          const [, op, val] = match;
          const numeric = extractNumber(nutrients[key] || "");
          if (!compare(numeric, op, parseInt(val))) return false;
        }

        return true;
      } catch {
        return false;
      }
    });

    const parsedResults = filteredResults.map((row) => {
      try {
        return {
          ...row,
          nutrients: typeof row.nutrients === "string" ? JSON.parse(row.nutrients) : row.nutrients,
        };
      } catch {
        return { ...row, nutrients: {} };
      }
    });

    return res.status(200).json({ data: parsedResults });
  } catch (err) {
    console.log("Error in searchRecipes: "+err);
    return res.status(500).json({message:"my bad"});
  }
};

function extractNumber(str = "") {
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function compare(a, op, b) {
  switch (op) {
    case "<": return a < b;
    case "<=": return a <= b;
    case ">": return a > b;
    case ">=": return a >= b;
    case "=": return a === b;
    default: return false;
  }
}

function getSequelizeOp(op) {
  switch (op) {
    case "<": return Op.lt;
    case "<=": return Op.lte;
    case ">": return Op.gt;
    case ">=": return Op.gte;
    case "=": return Op.eq;
    default: return Op.eq;
  }
}