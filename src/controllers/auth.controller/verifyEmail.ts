import * as accountService from "../../services/account.service";
import axios from "axios";
export const verifyEmail = (oidc) => async (ctx) => {
  const { username, uriRegister } = ctx.request.query;
  var acc = await accountService.get(username);
  const newUserInfoToClient = { ...acc };

  delete newUserInfoToClient.password;
  delete newUserInfoToClient.allow_client;
  delete newUserInfoToClient.allow_scope;
//    uriRegister = redirect_uri.replace("login_callback", "register");
console.log(newUserInfoToClient)
  await axios({
    method: "post",
    url: uriRegister,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: new URLSearchParams(newUserInfoToClient),
  });
  acc = { ...acc, email_verified: true };
  await accountService.update(username, acc);

  const title = "Verified Email";

  return ctx.render("verifySuccess", {
    title,
  });
};
