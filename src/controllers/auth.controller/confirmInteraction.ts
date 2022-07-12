import * as accountService from '../../services/account.service';

export const confirmInteraction = (oidc) => async (ctx) => {
    const interactionDetails = await oidc.interactionDetails(ctx.req, ctx.res);
    const {
      prompt: { name, details },
      params,
      session: { accountId },
    } = interactionDetails as any;

    if (name === 'consent') {
      const grant = interactionDetails.grantId
        ? await oidc.Grant.find(interactionDetails.grantId)
        : new oidc.Grant({
            accountId,
            clientId: params.client_id as string,
          });

      if (grant) {
        if (details.missingOIDCScope) {
          grant.addOIDCScope(details.missingOIDCScope.join(' '));
        }
        if (details.missingOIDCClaims) {
          grant.addOIDCClaims(details.missingOIDCClaims);
        }
        if (details.missingResourceScopes) {
          for (const [indicator, scopes] of Object.entries(
            details.missingResourceScopes
          )) {
            grant.addResourceScope(indicator, (scopes as any).join(' '));
          }
        }

        const grantId = await grant.save();

        const result = { consent: { grantId } };
        
        const scope = params.scope.split(' ');
        const client_id = params.client_id;

        const data = {};
        data[client_id] = scope;

        const account: any = await accountService.get(accountId);
        const allow_scope = account.allow_scope;

        if (!allow_scope) {
          await accountService.update(account.id, {
            allow_scope: {
              ...data
            }
          });
        } else {
          const client_allow_scope = allow_scope[client_id];
          if (!client_allow_scope) {
            await accountService.update(account.id, {
              allow_scope: {
                ...allow_scope,
                ...data
              }
            });
          } else {
            const missing_scope = scope.filter(x => !client_allow_scope.includes(x));
            if (missing_scope.length !== 0) {
              allow_scope[client_id] = missing_scope.concat(client_allow_scope)
              await accountService.update(account.id, {
                allow_scope
              });
            };
          }
        };

        await oidc.interactionFinished(ctx.req, ctx.res, result, {
          mergeWithLastSubmission: true,
        });
      }
    } else {
      ctx.throw(400, 'Interaction prompt type must be `consent`.');
    }
}