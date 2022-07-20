import { db } from "../db/postgresql/connection";

export const get = async (username: string) => {
    try {
        const result = await db.query(`SELECT * FROM oidc_account WHERE username = $1`, [username])
        const { rows } = result;
        if (rows.length === 0) {
            return undefined;
        } else {
            const user_info = rows[0];
            return user_info;
        }
    } catch (e: any) {
        console.log(e.message);
      }
}

export const update = async (username: string, data: any) => {
    const update_data: any = {
        email: data.email,
        email_verified: data.email_verified,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        picture: data.picture,
        birthdate: data.birthdate,
        created_at: data.created_at,
        password: data.password
    }

    const query_string: string[] = [];
    const query_param: any[] = [];
    let exist_param = 0;

    for (let key in update_data) {
        if (update_data[key] !== undefined) {
            exist_param += 1
            query_string.push(`${key} = $${exist_param}`);
            query_param.push(update_data[key]);
        }
    }

    if (query_string.length === 0) return;

    exist_param += 1
    query_param.push(username);

    try {
        return await db.query(`UPDATE oidc_account SET ${query_string.join(',\n')} WHERE username = $${exist_param}`, query_param);
    } catch (e: any) {
        console.log(e.message);
    }
}

export const set = async (username: string, value: any) => {
    const data = [value.username,
        value.password,
        value.email,
        false,
        value.firstName,
        value.lastName,
        value.birthdate,
        value.gender,
        "https://firebasestorage.googleapis.com/v0/b/oauth2-c28ca.appspot.com/o/avatar%2Fdefault_picture.jpg?alt=media&token=bbd9a270-6ed9-4e70-92cb-2aa12713439c",
    ];
    try {
        return await db.query(`INSERT oidc_account(username, password, email, email_verified, first_name, last_name, birthdate, gender, picture)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, data);
    } catch (e: any) {
        console.log(e.message);
    }
}
