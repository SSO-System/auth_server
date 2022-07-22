import * as accountService from '../../services/account.service';

export const verifyEmail = (oidc) => async (ctx) => {
    const {username} = ctx.request.query;
    console.log(username);
    var acc = await accountService.get(username);
    acc = {...acc,
        email_verified: true,
    }
    await accountService.update(username, acc);

    const title = "Verified Email"

    return ctx.render("verifySuccess", {
        title,
      });
}