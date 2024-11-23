require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const sequelize = require("./util/database");
const app = express();
const authenticateUser = require("./middleware/authenticateUser");

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const User = require("./models/user");
const Recipe = require("./models/recipe");
const Review = require("./models/review");
const Favorite = require("./models/favorite");
const Collection = require("./models/collection");
const CollectionRecipe = require("./models/collectionrecipe");
const Follow = require("./models/follow");
const AdminLog = require("./models/adminlog");

const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipe");
const favandcolRoutes = require("./routes/favoritesandcollections");
const searchRoutes = require("./routes/recipebrowsing");
const reviewRoutes = require("./routes/reviews");
const socialRoutes = require("./routes/social");
const adminRoutes = require("./routes/admin");

app.use("/user", userRoutes);
app.use("/recipe", recipeRoutes);
app.use("/manage", favandcolRoutes);
app.use("/search", searchRoutes);
app.use("/review", reviewRoutes);
app.use("/social", socialRoutes);
app.use("/admin", adminRoutes);

// -------------------------------
User.hasMany(Recipe);
Recipe.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

Recipe.hasMany(Review);
Review.belongsTo(Recipe);

User.belongsToMany(Recipe, { through: Favorite });
Recipe.belongsToMany(User, { through: Favorite });

User.hasMany(Collection);
Collection.belongsTo(User);

Collection.belongsToMany(Recipe, { through: CollectionRecipe });
Recipe.belongsToMany(Collection, { through: CollectionRecipe });

User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followedId",
});
User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId",
});

User.hasMany(AdminLog);
AdminLog.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("listening on 3000");
    });
  })
  .catch((err) => {
    console.log("error: " + err);
  });
