import * as accountService from "../../services/account.service";
import qrcode from "qrcode";
// import speakeasy from 'speakeasy';
export const login = (oidc) => async (ctx) => {
  const {
    prompt: { name, details },
  } = await oidc.interactionDetails(ctx.req, ctx.res);

  const account = await accountService.get(ctx.request.body.username);
  let otpauth = `otpauth://totp/Google:${account.email}?secret=${account.mfa_secret}?issuer=Google`;
  if (name === "login") {
    let result: any;

    // Account doesn't exist OR Password doesn't match
    if (account?.password !== ctx.request.body.password) {
      return ctx.render("login", {
        uid: ctx.params.uid,
        message: "Username or password is incorrect.",
        title: "Sign-In",
        authServerUrl: process.env.ISSUER,
      });
    }

    // Account haven't verify yet
    else if (!account.email_verified) {
      return ctx.render("login", {
        uid: ctx.params.uid,
        details: details,
        message: "Please check your email and verify your email address.",
        title: "Sign-In",
        authServerUrl: process.env.ISSUER,
      });
    }

    // OK
    else {
      result = {
        login: {
          accountId: account.username,
        },
      };

      const qrData = await qrcode.toDataURL(otpauth)     
      console.log("qr code here: ",otpauth);
      return ctx.render("multiFactor", {
        title: "Enter Verification Code",
        qrImage: qrData,
        uid: ctx.params.uid,
        username: ctx.request.body.username,
      });

      // result = {
      //   login: {
      //     accountId: ctx.request.body.username,
      //   },
      // };
      // const redirectTo = await oidc.interactionResult(ctx.req, ctx.res, result);
      // ctx.body = { redirectTo };
    }
  }
};
