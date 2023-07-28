const Category = require('../models/Category');
const categoryMapper = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {

  let categoriesQ = await Category.find().populate('subcategories').exec();
  let categoriesA = [];
  for (const c of categoriesQ) {
    categoriesA.push(categoryMapper(c));
  }

  ctx.body = {categories: categoriesA};
};
