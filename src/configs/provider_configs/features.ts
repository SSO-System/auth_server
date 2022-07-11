import { errors } from "oidc-provider";
import { rpInitiatedLogout } from "./rpInitiatedLogout";
// import  {nanoid}  from 'nanoid'
import base64url from "base64url";
import {randomFill, randomUUID} from 'crypto'

export const features = {
    rpInitiatedLogout,
    clientCredentials: { enabled: true },
    introspection: {
      enabled: true,
      allowedPolicy(ctx, client, token) {
        if (
          client.introspectionEndpointAuthMethod === "none" &&
          token.clientId !== ctx.oidc.client?.clientId
        ) {
          return false;
        }
        return true;
      },
    },
    revocation: { enabled: true },
    devInteractions: { enabled: false },
    resourceIndicators: {
      defaultResource(ctx) {
        return Array.isArray(ctx.oidc.params?.resource)
          ? ctx.oidc.params?.resource[0]
          : ctx.oidc.params?.resource;
      },
      getResourceServerInfo(ctx, resourceIndicator, client) {
        const scopes = ['openid', 'offline_access', 'address', 'phone', 'profile', 'email', 'api:read']
        const req_scope: string | undefined = ctx.oidc.params?.scope;
        
        if (req_scope === undefined) {
          return {
            scope: client.scope
          }
        } else {
          req_scope.split(' ').forEach((scope) => {
            if (!scopes.includes(scope))
              throw new errors.InvalidTarget(`Invalid scope '${scope}'`);
          })
          return {
            scope: client.scope
          }
        }
      },
    },
    registration: {
      enabled: false,
      idFactory(ctx) {
        return randomUUID();
      }, // see expanded details below
      initialAccessToken: false,
      issueRegistrationAccessToken: true,
      policies: undefined,
      secretFactory(ctx) {
        const bytes = Buffer.allocUnsafe(64);
        randomFill(bytes, (err, buf) => {
          if (err) {
            throw err;
          }
        });
        return base64url(bytes);
      } // see expanded details below

    },
  }