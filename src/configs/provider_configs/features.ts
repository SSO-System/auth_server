import { errors } from "oidc-provider";

export const features = {
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
  }