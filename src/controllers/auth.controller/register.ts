import * as accountService from '../../services/account.service';

export const register = (oidc) => async (ctx) => {
    const body = ctx.request.body;
    await accountService.set(body.username, {
      username: body.username,
      password: body.password,
    });
    ctx.body = { message: 'User successfully created'};
}