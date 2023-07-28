const Product = require('../models/Product');
const Category = require('../models/Category');
const connection = require('../libs/connection');

async function doWork(){

    await Category.deleteMany();
    await Product.deleteMany();

    const category = await Category.create({
        title: 'Category1',
        subcategories: [{
            title: 'Subcategory1',
        }],
    });

    await Product.create({
        title: 'ProductA',
        description: 'better than ProductB',
        price: 10,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
    });

    await Product.create({
        title: 'ProductB',
        description: 'better than ProductA',
        price: 10,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
    });

    await Category.syncIndexes();
    await Product.syncIndexes();
}

(async () => {
    await doWork();
    await connection.close();
})();
