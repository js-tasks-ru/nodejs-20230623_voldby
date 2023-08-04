const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {

    let user = await User.create({
            email: ctx.request.body.email,
            displayName: ctx.request.body.displayName
        });

    await user.setPassword(ctx.request.body.password);
    let token = uuid();
    user.set("verificationToken", token);
    await user.save();

    await sendMail({
               template: 'confirmation',
               locals: {token: user.verificationToken},
               to: user.email,
               subject: 'Подтвердите почту',
             });

    console.log('Email sent');
    ctx.body = { status: 'ok' };
};

module.exports.confirm = async (ctx, next) => {
    console.log(ctx.request.body.verificationToken);

    let user = await User.findOne({verificationToken: ctx.request.body.verificationToken});
    if (!user)
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');

    user.verificationToken = undefined;
    await user.save();

    const token = await ctx.login(user);
    ctx.body = {token};
    return next();
};
