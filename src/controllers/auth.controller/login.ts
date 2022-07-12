import * as accountService from '../../services/account.service';
 
export const login = (oidc) => async (ctx) => {
    const {
      prompt: { name },
    } = await oidc.interactionDetails(ctx.req, ctx.res);
    if (name === 'login') {
      const account = await accountService.get(ctx.request.body.username);
      let result: any;
      if (account?.password === ctx.request.body.password) {
        result = {
          login: {
            accountId: ctx.request.body.username,
          },
        };
      } else {
        result = {
          error: 'access_denied',
          error_description: 'Username or password is incorrect.',
        };
      }
      return oidc.interactionFinished(ctx.req, ctx.res, result, {
        mergeWithLastSubmission: false,
      });
    }
}