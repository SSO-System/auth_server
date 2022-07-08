import Router from "koa-router";
import { Provider } from "oidc-provider";
import authRouter from "../routes/auth.router";
import clientRouter from "../routes/client.router";

export default (oidc: Provider) => {
  const router = new Router();

  router.use(authRouter(oidc).routes());
  router.use(clientRouter().routes())

  return router;
};
