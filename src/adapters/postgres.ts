import { db } from '../db/postgresql/connection';

const prefixName = 'oidc_model';
export class PostgresAdapter {
  model: string;

  /**
   *
   * Creates an instance of MemoryAdapter for an oidc-provider model.
   *
   * @constructor
   * @param {string} name Name of the oidc-provider model. One of "Grant, "Session", "AccessToken",
   * "AuthorizationCode", "RefreshToken", "ClientCredentials", "Client", "InitialAccessToken",
   * "RegistrationAccessToken", "DeviceCode", "Interaction", "ReplayDetection",
   * "BackchannelAuthenticationRequest", or "PushedAuthorizationRequest"
   *
   */
  constructor(name: string) {
    // console.log(`MemoryAdapter(${name})`);
    this.model = prefixName + name.replace(/[A-Z]/g, (match) => { return ' ' + match }).split(' ').map(x => x.toLowerCase()).join('_');
  }

  /**
   *
   * Update or Create an instance of an oidc-provider model.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier that oidc-provider will use to reference this model instance for
   * future operations.
   * @param {object} payload Object with all properties intended for storage.
   * @param {number} expiresIn Number of seconds intended for this model to be stored.
   *
   */
  async upsert(id: string, payload: any, expiresIn: number): Promise<any> {
    try {
      return await db.query(`INSERT INTO ${this.model} (key, payload, expiresAt) 
                          VALUES ($1, $2, $3)
                          ON CONFLICT(key)
                          DO
                              UPDATE SET  payload = EXCLUDED.payload,
                                          expiresAt = EXCLUDED.expiresAt`
                          , [id, payload, new Date(Date.now() + expiresIn * 1000)])  
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   *
   * Return previously stored instance of an oidc-provider model.
   *
   * @return {Promise} Promise fulfilled with what was previously stored for the id (when found and
   * not dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async find(id: string): Promise<any> {
    try {
      if (this.model === 'oidc_model_client') {
        const result = await db.query(`SELECT * FROM ${this.model} WHERE client_id = $1`, [id]);
        const { rows } = result;
        if (rows.length === 0) {
            return undefined
        } else {
          return rows[0];
        }
      } else {
        const result = await db.query(`SELECT * FROM ${this.model} WHERE key = $1`, [id]);
        const { rows } = result;
        if (rows.length === 0) {
            return undefined
        } else {
          return rows[0].payload;
        }
      }
      
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   *
   * Return previously stored instance of DeviceCode by the end-user entered user code. You only
   * need this method for the deviceFlow feature
   *
   * @return {Promise} Promise fulfilled with the stored device code object (when found and not
   * dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   * @param {string} userCode the user_code value associated with a DeviceCode instance
   *
   */
  async findByUserCode(userCode: string): Promise<any> {
    try {
      const result = await db.query(`SELECT * FROM ${this.model} WHERE payload->>'userCode' = $1`, [userCode]);
      const { rows } = result;
      if (rows.length === 0) {
          return undefined
      } else {
          return rows[0].payload;
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   *
   * Return previously stored instance of Session by its uid reference property.
   *
   * @return {Promise} Promise fulfilled with the stored session object (when found and not
   * dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   * @param {string} uid the uid value associated with a Session instance
   *
   */
  async findByUid(uid: string): Promise<any> {
    try {
      const result = await db.query(`SELECT * FROM ${this.model} WHERE payload->>'uid' = $1`, [uid]);
      const { rows } = result;
      if (rows.length === 0) {
          return undefined
      } else {
          return rows[0].payload;
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   *
   * Mark a stored oidc-provider model as consumed (not yet expired though!). Future finds for this
   * id should be fulfilled with an object containing additional property named "consumed" with a
   * truthy value (timestamp, date, boolean, etc).
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async consume(id: string): Promise<any> {
    try {
      const result = await db.query(`SELECT * FROM ${this.model} WHERE key = $1`, [id]);
      const { rows } = result;
      if (rows.length === 0) {
          return;
      } else {
          const payload = rows[0].payload;
          payload.consumed = Date.now() / 1000;
          return await db.query(`UPDATE ${this.model} SET payload = $1 WHERE key = $2`, [payload, id]);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   *
   * Destroy/Drop/Remove a stored oidc-provider model. Future finds for this id should be fulfilled
   * with falsy values.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async destroy(id: string): Promise<any> {
    try {
      return await db.query(`DELETE FROM ${this.model} WHERE key = $1`, [id]);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  /**
   *
   * Destroy/Drop/Remove a stored oidc-provider model by its grantId property reference. Future
   * finds for all tokens having this grantId value should be fulfilled with falsy values.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} grantId the grantId value associated with a this model's instance
   *
   */
  async revokeByGrantId(grantId: string): Promise<any> {
    try {
      return await db.query(`DELETE FROM ${this.model} WHERE payload->>'grantId' = $1`, [grantId]);
    } catch (e: any) {
      console.log(e.message);
    }
  }
}
