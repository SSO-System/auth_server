import * as accountService from "../../services/account.service";

export const findAccount = async (ctx, id) => {
    const account = await accountService.get(id);
    return (
      account && {
        accountId: id,
        async claims(use /* id_token, userinfo */, scope, claims) {
          // console.log(`claims(${use}, ${scope}, ${JSON.stringify(claims)})`);
          if (!scope) return undefined;
          const openid = { sub: id };
          const email = {
            email: account.email,
            email_verified: account.emailVerified,
          };
          console.log({
            ...(scope.includes("openid") && openid),
            ...(scope.includes("email") && email),
          })
          return {
            ...(scope.includes("openid") && openid),
            ...(scope.includes("email") && email),
          };
        },
      }
    );
  }