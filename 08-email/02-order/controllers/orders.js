const mongoose = require('mongoose');
const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const orderConfirmation = require('../mappers/orderConfirmation')
const orderMapper = require('../mappers/order')

module.exports.checkout = async function checkout(ctx, next) {

    ctx.request.body.user = ctx.user.id;
    let order = await Order.create(ctx.request.body);
    await order.populate('product');

    await sendMail({
        template: 'order-confirmation',
        locals: orderConfirmation(order, order.product),
        to: ctx.user.email,
        subject: 'Подтверждение заказа',
    });

    ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    let orders = await Order.find({user: ctx.user.id}).populate('product');
    let res = [];
    for (const order of orders) {
        res.push(orderMapper(order));
    }

    ctx.body = {orders: res};
};
