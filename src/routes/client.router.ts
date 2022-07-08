import koaBody from "koa-body";
import Router from "koa-router";
import clientController from "../controllers/client.controller";

const bodyParser = koaBody();

export default () => {
  const router = new Router();

  const { client_form, client_registration, client_delete} =
    clientController();
  router.get("/clients", bodyParser, client_form);
  router.post("/clients", bodyParser, client_registration);
  router.delete("/clients", bodyParser, client_delete);

  return router;
};
