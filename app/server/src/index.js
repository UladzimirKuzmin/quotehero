import Koa from 'koa';
import logger from 'koa-morgan';
import env from 'dotenv';

env.config();

const server = new Koa();

server
  .use(logger('tiny'))
  .use(async ctx => {
    ctx.body = 'Hello World!';
  })
  .listen(process.env.PORT, () => {
    console.log(`server start listening on port ${process.env.PORT}`);
  });
  