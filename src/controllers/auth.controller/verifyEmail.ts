import * as accountService from '../../services/account.service';

export const verifyEmail = (oidc) => async (ctx) => {
    const {username} = ctx.request.query;
    console.log(username);
    var acc = await accountService.get(username);
    const accId = acc.id;
    acc = {...acc,
        email_verified: true,
    }
    await accountService.update(accId, acc);

    return ctx.body="email verified";
}