export const registerForm = (oidc) => async (ctx) => {
    return ctx.render('userRegister', {
        title: 'User Registration', 
        authServerUrl: process.env.ISSUER
      })
}