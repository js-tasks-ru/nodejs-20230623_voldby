const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscriberSet = new Set();

router.get('/subscribe', async (ctx, next) => {

   let promise = new Promise((resolve, reject) => {
       //Add subscriber
       subscriberSet.add(resolve);
       ctx.state.resolve = resolve;
       ctx.state.requestCompleted = false;
   });

    ctx.req.on('close', () => {
        //console.log('Request closed');
        if(!ctx.state.requestCompleted){
            //console.log("Connection closed. Subscriber stopped listening for the new messages.");
            //Remove resolver from subscriberSet
            subscriberSet.delete(ctx.state.resolve);
        }
    });

   ctx.body = await promise;
   ctx.state.requestCompleted = true;
});

router.post('/publish', async (ctx, next) => {
    let msg = ctx.request.body;
    if (msg["message"]) {
        const iterator = subscriberSet.values();
        let res;
        while (true) {
            res = iterator.next();
            if (res.done)
                break;

            res.value(msg["message"]); //resolve
            subscriberSet.delete(res.value);
        }

        ctx.status = 200;
    }
});

app.use(router.routes());

module.exports = app;
