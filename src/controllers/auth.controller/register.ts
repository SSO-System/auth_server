// import { queryString } from 'query-string';
// import { interaction } from './interaction';
import * as accountService from "../../services/account.service";

function debug(obj: any) {
  return Object.entries(obj)
    .map(
      (ent: [string, any]) =>
        `<strong>${ent[0]}</strong>: ${JSON.stringify(ent[1])}`
    )
    .join("<br>");
}

export const checkRegister = (oidc) => async (ctx) => {
  const body = ctx.request.body;
  console.log("checkRegister", body);
  
  const user = await accountService.get(body.username);
  ctx.response.status = 200;

  if (user) {
    console.log("user already exists");
    return (ctx.body = { message: "user already exists" });
  } else {
    return (ctx.body = { message: "success" });
  }
  //  ctx.response.message = {data: 1}
};

export const register = (oidc) => async (ctx) => {
  const body = ctx.request.body;

  await accountService.set(body.username, body);
  const { uid, prompt, params, session } = (await oidc.interactionDetails(
    ctx.req,
    ctx.res
  )) as any;

  let result: any;
  result = {
    login: {
      accountId: body.username,
    },
  };  

  ctx.status = 200;

  console.log("login request")
  return ctx.render('login', {
          uid,
          details: prompt.details,
          params,
          session: session ? debug(session) : undefined,
          title: 'Sign-In',
          dbg: {
            params: debug(params),
            prompt: debug(prompt),
          },
          authServerUrl: process.env.ISSUER
        });

};
