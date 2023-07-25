const Product = require('../models/Product');
const prodMapper = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {

  let txtForSearch = ctx.request.query['query'];
  let prodsRes = [];

  if (txtForSearch && txtForSearch.length > 0) {
    let prods = await Product.find({ $text: {$search: txtForSearch}}).sort( { score: { $meta: "textScore" } } );

    for(const pD of prods) {
      prodsRes.push(prodMapper(pD));
    }
  }

  ctx.body = {products: prodsRes};
};
