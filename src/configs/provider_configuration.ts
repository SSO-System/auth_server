import { Configuration } from "oidc-provider";
import { FirestoreAdapter } from '../adapters/firestore';
import { findAccount } from "./provider_configs/findAccount";
import { clientBasedCORS, extraClientMetadata } from './provider_configs/clientBasedCors';
import { claims } from './provider_configs/claims';
import { features } from "./provider_configs/features";
import { jwks } from "./provider_configs/jwks";
import { ttl } from "./provider_configs/ttl";
import { scopes } from "./provider_configs/scopes";

export const configuration: Configuration = {
  adapter: FirestoreAdapter,
  extraClientMetadata,
  clientBasedCORS,
  findAccount: findAccount,
  clients: [
    // Dynamic Clients
  ],
  claims,
  scopes: scopes,
  features,
  jwks,
  cookies: {
    keys: ["subzero"],
  },
  ttl
};
