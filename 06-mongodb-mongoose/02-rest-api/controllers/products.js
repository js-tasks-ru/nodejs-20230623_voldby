const Product = require('../models/Product');
const productMapper = require('../mappers/product');
const mongoose = require("mongoose").default;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    ctx.throw(400, 'invalid subcategory id');
  }

  let products = await Product.find({subcategory: subcategory}).exec();
  let productsA = products.map((product) => productMapper(product));

  ctx.body = {products: productsA};
};

module.exports.productList = async function productList(ctx, next) {
  let productsQ = await Product.find();
  let productsA = [];
  for(const p of productsQ) {
    productsA.push(productMapper(p));
  }

  ctx.body = {products: productsA};
};

module.exports.productById = async function productById(ctx, next) {

  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid id');
  }

  let productD = await Product.findById(ctx.params.id);
  if (!productD){
    ctx.throw(404, 'product not found')
  }

  ctx.body = {product: productMapper(productD)};
};

