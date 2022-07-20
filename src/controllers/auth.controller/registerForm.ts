export const registerForm = (oidc) => async (ctx) => {
    const {uid} = ctx.request.params;
    // const cookieOptions = {
    //   path: `/interaction/${params.interaction}`,

    // }
    // ctx.cookies.set("_interaction", params.interaction)
    // ctx.cookies.set("_interaction.sig", params.interactionSig)
    // console.log(ctx.request.headers)
    return ctx.render('userRegister', {
        title: 'User Registration', 
        authServerUrl: process.env.ISSUER,
        uid
      })
}
