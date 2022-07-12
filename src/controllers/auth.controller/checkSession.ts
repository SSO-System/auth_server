export const checkSession = (oidc) => async (ctx) => {
    const session = await oidc.Session.get(ctx);
    ctx.body = session;
}