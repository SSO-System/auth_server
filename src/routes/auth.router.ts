import { verifyEmail } from './../controllers/auth.controller/verifyEmail';
import koaBody from "koa-body";
import Router from "koa-router";
import { Provider } from "oidc-provider";
import authController from "../controllers/auth.controller";
// import { onlyClient } from "../middlewares/auth.middleware";
import { noCache } from "../middlewares/no-cache.middleware";
const bodyParser = koaBody();

export default (oidc: Provider) => {
  const router = new Router();

  const { abortInteraction, confirmInteraction, interaction, login, register, registerForm, checkRegister, checkSession, verifyEmail } =
    authController(oidc);
  
  router.get('/interaction/:uid/register1', registerForm);
  router.get('/verifyEmail', verifyEmail);
  router.post('/checkRegister',bodyParser, checkRegister);
  router.post("/interaction/:uid/register", bodyParser, register);

  router.post("/interaction/:uid/login", noCache, bodyParser, login);
  router.post("/interaction/:uid/confirm", noCache, confirmInteraction);
  router.get("/interaction/:uid/abort", noCache, abortInteraction);
  router.get("/interaction/:uid", noCache, interaction);
  router.get("/check_session", noCache, checkSession);

  return router;
};
