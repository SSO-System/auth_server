import { Pool } from 'pg';

let pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'DEMO SSO',
        password: 'giacat',
        port: '5432'
});

export const db = pool;