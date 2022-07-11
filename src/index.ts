import cors from "@koa/cors";
import dotenv from "dotenv";
import helmet from 'helmet';
import Koa from "koa";
import render from "koa-ejs";
import mount from "koa-mount";
import koaStatic from "koa-static";
import path from "path";
import { configuration } from "./configs/provider_configuration";
import { oidc } from "./configs/provider";
import router from "./routes";
import { initializeOIDCModel } from "./db/firestore/connection";
import { promisify } from "util";

dotenv.config({ path: path.resolve(".env") });

const PORT = process.env.PORT || 3000;
const app = new Koa();

const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];

const pHelmet = promisify(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives,
  },
}));

app.use(async (ctx: any, next) => {
  const origSecure = ctx.req.secure;
  ctx.req.secure = ctx.request.secure;
  await pHelmet(ctx.req, ctx.res);
  ctx.req.secure = origSecure;
  return await next();
});

render(app, {
  cache: false,
  viewExt: "ejs",
  layout: false,
  root: path.resolve("src/views"),
});

if (process.env.NODE_ENV === 'production') {
  app.proxy = true;

  app.use(async (ctx, next) => {
    if (ctx.secure) {
      await next();
    } else if (ctx.method === 'GET' || ctx.method === 'HEAD') {
      ctx.status = 303;
      ctx.redirect(ctx.href.replace(/^http:\/\//i, 'https://'));
    } else {
      ctx.body = {
        error: 'invalid_request',
        error_description: 'do yourself a favor and only use https',
      };
      ctx.status = 400;
    }
  })
}

const start = async () => {
  await initializeOIDCModel();
  
  const provider = oidc(process.env.ISSUER as string, configuration);

  app.use(koaStatic(path.resolve("public")));
  app.use(router(provider).routes());
  app.use(mount(provider.app));

  app.listen(PORT, () => {
    console.log(
      `oidc-provider listening on port ${PORT}, check http://localhost:${PORT}/.well-known/openid-configuration`
    );
  });
};

void start();
