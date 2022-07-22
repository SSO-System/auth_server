// import { verifyEmail } from './../controllers/auth.controller/verifyEmail';
import koaBody from "koa-body";
import Router from "koa-router";
import { Provider } from "oidc-provider";
import authController from "../controllers/auth.controller";
// import { onlyClient } from "../middlewares/auth.middleware";
import { noCache } from "../middlewares/no-cache.middleware";
const bodyParser = koaBody();

export default (oidc: Provider) => {
  const router = new Router();

  const { abortInteraction, confirmInteraction, interaction, login, register, registerForm, 
    checkRegister, verifyEmail, multiFactorAuth } =  authController(oidc);
  
  // OIDC Resolve
  router.get("/interaction/:uid", noCache, interaction);

  // Login
  router.post("/interaction/:uid/login", noCache, bodyParser, login);                   // Check login information
  router.post("/interaction/:uid/mfa", noCache, bodyParser, multiFactorAuth);           // Multi-factor Authentication
  router.post("/interaction/:uid/confirm", noCache, confirmInteraction);                // Confirm Login
  router.get("/interaction/:uid/abort", noCache, abortInteraction);                     // Abort Login

  // Register
  router.get('/interaction/:uid/register1', registerForm);
  router.get('/verifyEmail', verifyEmail);
  router.post('/checkRegister',bodyParser, checkRegister);
  router.post("/interaction/:uid/register", bodyParser, register);

  return router;
};
