import * as accountService from "../../services/account.service";

import nodemailer from "nodemailer";

function sendMailValidate(newUser) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dangluan15112001@gmail.com",
      pass: "xsisifbvehjbtsfx",
    },
  });
  console.log("new user", newUser);

  var mailOptions = {
    from: "dangluan15112001@gmail.com",
    to: newUser.email,
    subject: "Welcome new user...",
    html: `<h1>Welcome</h1>
    <a href="http://localhost:3000/verifyEmail?username=${newUser.username}&uriRegister=${newUser.uriRegister}">Click to verify your email</a>`,
  };

  var sendMailFun = (mailOptions) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };
  sendMailFun(mailOptions);
}

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
  const {
    uid,
    prompt,
    params: { redirect_uri },
    session,
    params,
  } = (await oidc.interactionDetails(ctx.req, ctx.res)) as any;
  const uriRegister = redirect_uri.replace("login_callback", "register");

  // save new user information
  await accountService.set(body.username, body);
  // send email verify mail
  const emailVerifiedInfo = { email: body.email, username: body.username, uriRegister: uriRegister };
  sendMailValidate(emailVerifiedInfo);



  let result: any;
  result = {
    login: {
      accountId: body.username,
    },
  };

  ctx.status = 200;

  console.log("login request");
  return ctx.render("login", {
    uid,
    details: prompt.details,
    params,
    session: session ? debug(session) : undefined,
    title: "Sign-In",
    dbg: {
      params: debug(params),
      prompt: debug(prompt),
    },
    authServerUrl: process.env.ISSUER,
  });
};
