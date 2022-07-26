import * as accountService from "../../services/account.service";
import base64url from "base64url";

import axios from "axios";
export const verifyEmail = (oidc) => async (ctx) => {
  const { username, uriRegister } = ctx.request.query;
  var acc = await accountService.get(username);
  const newUserInfoToClient = { ...acc };

  delete newUserInfoToClient.password;
  delete newUserInfoToClient.allow_client;
  delete newUserInfoToClient.allow_scope;
//    uriRegister = redirect_uri.replace("login_callback", "register");
ctx.status = 200
console.log(newUserInfoToClient)
  await axios({
    method: "post",
    url: uriRegister,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: new URLSearchParams(newUserInfoToClient),
  });
  const mfa_secret = base64url(acc.username)
  acc = { ...acc, email_verified: true,mfa_secret: mfa_secret  };


  await accountService.update(username, acc);


  const title = "Verified Email";

  return ctx.render("verifySuccess", {
    title,
  });
};
