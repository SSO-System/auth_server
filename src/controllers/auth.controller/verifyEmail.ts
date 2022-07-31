import { get } from './../../services/client.service';
import * as accountService from "../../services/account.service";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

export const verifyEmail = (oidc) => async (ctx) => {
  const { username, uriRegister } = ctx.request.query;
  var acc = await accountService.get(username);
  const newUserInfoToClient = { ...acc };

  delete newUserInfoToClient.password;
  delete newUserInfoToClient.allow_client;
  delete newUserInfoToClient.allow_scope;
//    uriRegister = redirect_uri.replace("login_callback", "register");
ctx.status = 200

  // const mfa_secret = base64url(acc.username)
  const secret = speakeasy.generateSecret().base32;
  if(!acc.email_verified)
  {
    acc = { ...acc, email_verified: true,mfa_secret: secret  };
    await accountService.update(username, acc);
  }


  let otpauth = `otpauth://totp/SSO:${acc.email}?secret=${secret}&issuer=SSO`;
  const getQr = async (otpauth) => {
    return await qrcode.toDataURL(otpauth)

  }
  const title = "Verified Email";
  const qrData = await getQr(otpauth)

  return ctx.render("verifySuccess", {
    title,
    qrImage: qrData
  });
};
