import * as accountService from "../../services/account.service";
import totp from "totp-generator";

export const multiFactorAuth = (oidc) => async (ctx) => {
    if (!ctx.request.body.username || !ctx.request.body.verification_code) {
        const result = {
            error: "access_denied",
            error_description: "Missing Information",
          };
          ctx.body = result;
    } else {
        const account = await accountService.get(ctx.request.body.username);
        const mfa_secret = account.mfa_secret;
        const check_code = ctx.request.body.verification_code;
        const code = totp(mfa_secret);

        if (code === check_code) {
            const result = {
                login: {
                    accountId: ctx.request.body.username,
                },
            };
            const redirectTo = await oidc.interactionResult(ctx.req, ctx.res, result);
            ctx.body = { redirectTo };
        } else {
            const result = {
                error: "access_denied",
                error_description: "That code is invalid or expired. Try another.",
            };
            ctx.body = result;
        }
    }
};
