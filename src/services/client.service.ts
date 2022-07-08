import { Client } from "../db/firestore/models/Client";

export const get = async (client_id: string) => {
    const doc: any = await Client.where('client_id', '==', client_id).get();
    if (doc.empty) {
        return undefined;
    } else {
        return doc.docs[0].data();
    }
}

export const set = async (client_id: string, value: any) => {
    await Client.doc(client_id).set({
        client_id: value.client_id,
        client_secret: value.client_secret,
        grant_types: value.grant_types,
        redirect_uris: value.redirect_uris,
        post_logout_redirect_uris: value.post_logout_redirect_uris,
        scope: value.scope,
        "urn:custom:client:allowed-cors-origins": value.urn,

    })
}

export const remove = async (client_id: string) => {
    const doc: any = await Client.where('client_id', '==', client_id).get();
    if (doc.empty) {
        return undefined;
    } else {
        return await Client.doc(client_id).delete()
    }
}
