import { Pool } from 'pg';

let pool = new Pool({

        user: 'sso',
        host: '42.117.5.115',
        database: 'INTERN-SSO',
        password: 'dientoan@123',
        port: '5432'
});
console.log("connect here")

export const db = pool;