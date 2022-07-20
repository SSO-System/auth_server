import * as accountService from '../../services/account.service';
 
export const login = (oidc) => async (ctx) => {
    const {
      prompt: { name },
    } = await oidc.interactionDetails(ctx.req, ctx.res);
    if (name === 'login') {
      const account = await accountService.get(ctx.request.body.username);
      let result: any;
      if(!account.email_verified) {
        result = {
          error: 'unverified',
          error_description: 'Please check your email and verify your email address',
        };
      }
      if (account?.password === ctx.request.body.password) {
        result = {
          login: {
            accountId: ctx.request.body.username,
          },
        };
        const redirectTo = await oidc.interactionResult(ctx.req, ctx.res, result);

        ctx.body = { redirectTo };

      } else {
        result = {
          error: 'access_denied',
          error_description: 'Username or password is incorrect.',
        };
        ctx.body = result;
      }
      
    }
}