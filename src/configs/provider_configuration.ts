import { Configuration } from "oidc-provider";
import { FirestoreAdapter } from '../adapters/firestore';
import { findAccount } from "./provider_configs/findAccount";
import { clientBasedCORS, extraClientMetadata } from './provider_configs/clientBasedCors';
import { claims } from './provider_configs/claims';
import { features } from "./provider_configs/features";
import { jwks } from "./provider_configs/jwks";
import { ttl } from "./provider_configs/ttl";
import { scopes } from "./provider_configs/scopes";
import { renderError } from "./provider_configs/renderError";

export const configuration: Configuration = {
  extraClientMetadata,
  clientBasedCORS,
  findAccount,
  claims,
  scopes,
  renderError,
  features,
  jwks,
  ttl,
  adapter: FirestoreAdapter,
  clients: [
    // Dynamic Clients
  ],
  cookies: {
    keys: ["subzero"],
  },
};
