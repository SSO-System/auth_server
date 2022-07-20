import { db } from "../db/postgresql/connection";

export const get = async (client_id: string) => {
    try {
        const result = await db.query(`SELECT * FROM oidc_model_client WHERE client_id = $1`, [client_id]);
        const { rows } = result;
        if (rows.length === 0) {
            return undefined;
        } else {
            return rows[0];
        }
    } catch (e: any) {
        console.log(e.message);
    }
}

export const set = async (client_id: string, value: any) => {
    try {
        return await db.query(`INSERT INTO oidc_model_client(client_id, client_secret, grant_types, redirect_uris, post_logout_redirect_uris,
            scope, "urn:custom:client:allowed-cors-origins") VALUES($1, $2, $3, $4, $5, $6, $7)`, 
            [value.client_id, value.client_secret, value.grant_types, value.redirect_uris, value.post_logout_redirect_uris, value.scope, value.urn]);
    } catch (e: any) {
        console.log(e.message);
    }
}

export const remove = async (client_id: string) => {
    try {
        return await db.query(`DELETE FROM oidc_model_client WHERE client_id = $1`, [client_id]);
    } catch (e: any) {
        console.log(e.message);
    }
}
