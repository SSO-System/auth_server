import * as accountService from "../../services/account.service";

export const findAccount = async (ctx, id) => {
    const account = await accountService.get(id);
    return (
      account && {
        accountId: id,
        async claims(use /* id_token, userinfo */, scope, claims) {
          
          if (!scope) return undefined;
          const openid = { sub: id };
          const profile = {
            birthdate: account.birthdate,
            gender: account.gender,
            firstname: account.firstname,
            lastname: account.lastname,
            picture: account.picture,
            username: account.username
          }
          const email = {
            email: account.email,
            email_verified: account.email_verified,
          };

          return {
            ...(scope.includes("openid") && openid),
            ...(scope.includes("email") && email),
            ...(scope.includes("profile") && profile),
          };
        },
      }
    );
  }