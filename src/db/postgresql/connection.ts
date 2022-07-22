import { Pool } from 'pg';

let pool = new Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'DEMO SSO',
        password: 'giacat',
        port: '5432'
});
console.log("connect here")

export const db = pool;