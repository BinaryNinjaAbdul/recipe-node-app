require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/***
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const recipes = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = {
      recipes,
      thai,
      american,
      chinese,
    };

    res.render("index", {
      title: "Cooking Blog - Homepage",
      categories,
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * GET / cateogries
 */

exports.exploreCateogries = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", {
      title: "Cooking Blog - All recipes",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * GET / cateogries/:name
 */

exports.exploreCategoryByName = async (req, res) => {
  try {
    const foodByCateogry = await Recipe.find({ category: req.params.name });

    res.render("cateogryByName", {
      title: "Cooking Blog - All recipes",
      name: req.params.name,
      foodByCateogry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * GET /recipe/:id
 */

exports.exploreRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", {
      title: `${recipe.name}`,
      recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * POST /search
 */

exports.searchRecipe = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;

    const recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });

    res.render("search", {
      title: `${searchTerm}`,
      recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * GET /explore-latest
 * Explore Latest
 */

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

    res.render("explore-latest", {
      title: "Latest",
      recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * GET /explore-random
 * Explore Random
 */

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);

    const recipe = await Recipe.findOne().skip(random).exec();

    res.render("explore-random", {
      title: `Cooking Blog - ${recipe.name}`,
      recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * GET /explore-random
 * Explore Random
 */

exports.submitRecipe = async (req, res) => {
  try {
    const infoErrorObjs = req.flash("infoErrors");
    const infoSubmitObjs = req.flash("infoSubmit");

    res.render("submit-recipe", {
      title: "Cooking Blog -  Submit Recipe",
      infoErrorObjs,
      infoSubmitObjs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      messsage: error.messsage || "Error Occured",
    });
  }
};

/***
 * POST /explore-random
 * Explore Random
 */

exports.submitRecipeOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No file were uploaded');
    } else{
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added");
    res.redirect("submit-recipe");
  } catch (error) {
    console.log(error)
    req.flash("infoErrors", error);
    res.redirect("submit-recipe");
  }
};
