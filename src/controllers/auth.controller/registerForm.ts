export const registerForm = (oidc) => async (ctx) => {
    const {uid} = ctx.request.params;

    return ctx.render('userRegister', {
        title: 'User Registration', 
        authServerUrl: process.env.ISSUER,
        uid
      })
}
