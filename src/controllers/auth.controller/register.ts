import * as accountService from '../../services/account.service';

export const register = (oidc) => async (ctx) => {
  const err = {}
  const body = ctx.request.body;
  const user = await accountService.get(body.username);
  if(user)
  {
    console.log("user already exists")
    return ctx.render('userRegister', {
      title: 'User Registration', 
      authServerUrl: process.env.ISSUER
    })
  }
  // const newUser = {
  //   username: body.username,
  //   password: body.password,
  //   firstname: body.firstname,
  //   lastname: body.lastname,
  //   email: body.email,
  //   gender: body.gender,
  //   birthdate: body.birthdate
  // }
  await accountService.set(body.username, body);
  console.log(body);
  ctx.body = { message: 'User successfully created'};
}