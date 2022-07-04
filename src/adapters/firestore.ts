import { OIDCModel } from '../db/firestore/models/OIDCModel';
const undefinedFirestoreValue = 'custom.type.firestore';

export class FirestoreAdapter {
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
    this.model = name;
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
    return await OIDCModel.collection(this.model).doc(id).set(
      {
        key: id,
        payload: this.updateNestedObject(payload, undefined, undefinedFirestoreValue),
        expiresAt: new Date(Date.now() + expiresIn * 1000)
      }, 
      { 
        merge: true
      });    
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
    const doc: any = await OIDCModel.collection(this.model).doc(id).get();
    if (!doc.exists) {
      return undefined;
    } else {
      if (this.model === "Client") {
        return this.updateNestedObject(doc.data(), undefinedFirestoreValue, undefined);
      } else {
        return this.updateNestedObject(doc.data().payload, undefinedFirestoreValue, undefined);
      }
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
    const doc: any = await OIDCModel.collection(this.model).where('payload.userCode', '==', userCode).get();
    if (doc.empty) {
      return undefined;
    } else {
      return this.updateNestedObject(doc.docs[0].data().payload, undefinedFirestoreValue, undefined);
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
    const doc: any = await OIDCModel.collection(this.model).where('payload.uid', '==', uid).get();
    if (doc.empty) {
      return undefined;
    } else {
      return this.updateNestedObject(doc.docs[0].data().payload, undefinedFirestoreValue, undefined);
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
    const doc: any = await OIDCModel.collection(this.model).doc(id).get();
    if (!doc.exists) {
      return;
    } else {
      const data = doc.data();
      data.payload.consumed = Date.now() / 1000;
      await OIDCModel.collection(this.model).doc(id).update(data);
    };
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
    const doc: any = await OIDCModel.collection(this.model).doc(id).get();
    if (doc.exists) {
      await OIDCModel.collection(this.model).doc(id).delete();
    } else {
      return;
    };
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
    const docs: any = await OIDCModel.collection(this.model).where('payload.grantId', '==', grantId).get();
    const idList: string[] = [];

    docs.forEach((doc) => {
      idList.push(doc.id);
    });

    for (let i = 0; i < idList.length; i++) {
      await OIDCModel.collection(this.model).doc(idList[i]).delete();
    };
  }

  /**
   * Replace a value in the object with another value
   *
   * @private
   * @param {object} internalObject
   * @param {(string | undefined)} value
   * @param {(string | undefined)} toReplaceValue
   * @returns
   * @memberof FirestoreAdapter
   */

  updateNestedObject(object: any, value: string | undefined, toReplaceValue: string | undefined): any {
    const internalObject: any = Array.isArray(object) ? object : { ...object }; 
    const keys: any = Object.keys(internalObject);
    for (let index = 0; index < keys.length;) {
      const key = keys[index];
      if (Object.prototype.hasOwnProperty.call(internalObject, key)) {
        if (internalObject[key] === value) {
          internalObject[key] = toReplaceValue;
        }
        if (typeof internalObject[key] === 'object') {
          // Recursion
          internalObject[key] = this.updateNestedObject(internalObject[key], value, toReplaceValue);
        }
      }
      index += 1;
    }
    return internalObject;
  }
}
