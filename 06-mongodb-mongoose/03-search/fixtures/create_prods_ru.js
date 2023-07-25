const Product = require('../models/Product');
const Category = require('../models/Category');
const connection = require('../libs/connection');

async function doWork(){

    await Category.deleteMany();
    await Product.deleteMany();

    const category = await Category.create({
        title: 'Категория1',
        subcategories: [{
            title: 'Подкатегория1',
        }],
    });

    await Product.create({
        title: 'ПродуктА',
        description: 'лучше, чем ПродуктБ',
        price: 10,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
    });

    await Product.create({
        title: 'ПродуктБ',
        description: 'лучше, чем ПродуктА',
        price: 10,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
    });

    await Product.create({
        title: 'ПродуктВ',
        description: 'лучше, чем ПродуктБ',
        price: 11,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
    });

    await Product.create({
        title: 'ПродуктГ',
        description: 'лучше, чем ПродуктА',
        price: 12,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
    });

    await Product.create({
        title: 'ПродуктД',
        description: 'лучше, чем ПродуктГ',
        price: 12,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
    });

    await Category.syncIndexes();
    await Product.syncIndexes();
}

(async () => {
    await doWork();
    console.log(await connection.close());
})();
