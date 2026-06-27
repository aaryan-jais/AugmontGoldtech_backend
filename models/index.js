const sequelize = require("../config/db");

const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");

Category.hasMany(Product, {
  foreignKey: "categoryId",
  onDelete: "CASCADE"
});

Product.belongsTo(Category, {
  foreignKey: "categoryId"
});

module.exports = {
  sequelize,
  User,
  Category,
  Product
};