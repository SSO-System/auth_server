export const rpInitiatedLogout = {
    enable: true,
    logoutSource: async function logoutSource(ctx, form) {
        // @param ctx - koa request context
        // @param form - form source (id="op.logoutForm") to be embedded in the page and submitted by
        //   the End-User
        return ctx.render('logoutSource', {
            title: 'Logout Request',
            host: ctx.host,
            form: form
        })
    },
    postLogoutSuccessSource: async function postLogoutSuccessSource(ctx) {
        // @param ctx - koa request context
        const {
          clientId, clientName, clientUri, initiateLoginUri, logoUri, policyUri, tosUri,
        } = ctx.oidc.client || {}; // client is defined if the user chose to stay logged in with the OP
        const display = clientName || clientId;
        console.log(ctx.oidc);
        ctx.body = `<!DOCTYPE html>
          <head>
            <title>Sign-out Success</title>
            <style>/* css and html classes omitted for brevity, see lib/helpers/defaults.js */</style>
          </head>
          <body>
            <div>
              <h1>Sign-out Success</h1>
              <p>Your sign-out ${display ? `with ${display}` : ''} was successful.</p>
            </div>
          </body>
          </html>`;
    }
      
}