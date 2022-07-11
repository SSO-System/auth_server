import { errors } from "oidc-provider";
const { URL } = require('url');
const corsProp = 'urn:custom:client:allowed-cors-origins';

const isOrigin = (value) => {
    if (typeof value !== 'string') {
      return false;
    }
    try {
      const { origin } = new URL(value);
      // Origin: <scheme> "://" <hostname> [ ":" <port> ]
      return value === origin;
    } catch (err) {
      return false;
    }
  }

export const extraClientMetadata = {
    properties: [corsProp],
    validator(ctx, key, value, metadata) {
      if (key === corsProp) {
        // set default (no CORS)
        if (value === undefined) {
          metadata[corsProp] = [];
          return;
        }
        // validate an array of Origin strings
        if (!Array.isArray(value) || !value.every(isOrigin)) {
          throw new errors.InvalidClientMetadata(`${corsProp} must be an array of origins`);
        }
      }
    },
}

export function clientBasedCORS(ctx, origin, client) {
  console.log('clientBasedCORS');
  // ctx.oidc.route can be used to exclude endpoints from this behaviour, in that case just return
  // true to always allow CORS on them, false to deny
  // you may also allow some known internal origins if you want to
  return client[corsProp].includes(origin);
}