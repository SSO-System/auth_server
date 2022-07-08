import cors from "@koa/cors";
import dotenv from "dotenv";
import Koa from "koa";
import render from "koa-ejs";
import mount from "koa-mount";
import koaStatic from "koa-static";
import path from "path";
import { configuration } from "./configs/provider_configuration";
import { oidc } from "./configs/provider";
import router from "./routes";
import { initializeOIDCModel } from "./db/firestore/connection";

dotenv.config();

const start = async () => {
  await initializeOIDCModel();
  const app = new Koa();
  render(app, {
    cache: false,
    viewExt: "ejs",
    layout: false,
    root: path.resolve("src/views"),
  });
// console.log(process.env.ISSUER)
  const provider = oidc(process.env.ISSUER as string, configuration);

  app.use(cors());
  app.use(koaStatic(path.resolve("public")));
  app.use(router(provider).routes());
  app.use(mount(provider.app));

  app.listen(process.env.PORT, () => {
    console.log(
      `oidc-provider listening on port ${process.env.PORT}, check http://localhost:${process.env.PORT}/.well-known/openid-configuration`
    );
  });
};

void start();
