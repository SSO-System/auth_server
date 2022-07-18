import * as accountService from '../../services/account.service';
import { confirmInteraction } from './confirmInteraction';

function debug(obj: any) {
    return Object.entries(obj)
      .map(
        (ent: [string, any]) =>
          `<strong>${ent[0]}</strong>: ${JSON.stringify(ent[1])}`
      )
      .join('<br>');
}

export const interaction = (oidc) => async (ctx) => {
 
  const { uid, prompt, params, session } = (await oidc.interactionDetails(
    ctx.req,
    ctx.res
    )) as any;
    
    
    if (session?.accountId !== undefined) {
      const account = await accountService.get(session.accountId);
      const client_id = params.client_id;
      
      if (!account.allow_client.includes(client_id)) {        
        return ctx.render('access_denied', {
          authUrl: process.env.ISSUER,
          title: 'Access Denied',
          clientId: client_id,
          errorCode: 403
        })
      }
    }

    if (prompt.name === 'login') {
      return ctx.render('login', {
        uid,
        details: prompt.details,
        params,
        session: session ? debug(session) : undefined,
        title: 'Sign-In',
        dbg: {
          params: debug(params),
          prompt: debug(prompt),
        },
        authServerUrl: process.env.ISSUER,
      });
    } else if (prompt.name === 'consent') {
      if (session.accountId) {
        const account = await accountService.get(session.accountId);

        if (account.allow_scope) {
          if (account.allow_scope[params.client_id]) {
            const request_scope = params.scope.split(' ');
            const missing_scope = request_scope.filter(scope => !account.allow_scope[params.client_id].includes(scope));

            if (missing_scope.length === 0) {
              try {
                return await confirmInteraction(oidc)(ctx);
              } catch (e) {
                console.log(e);
              } 
            }
          }
        }
        
      }

      return ctx.render('consent', {
        uid,
        title: 'Authorize',
        clientId: params.client_id,
        scope: params.scope.replace(/ /g, ', '),
        session: session ? debug(session) : undefined,
        dbg: {
          params: debug(params),
          prompt: debug(prompt),
        },
      });
    } else {
      ctx.throw(501, 'Not implemented.');
    }
}