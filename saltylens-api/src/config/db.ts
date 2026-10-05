import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
});

pool.on('connect', () => {
    console.log('⚡ PostgreSQL Connected');
});

// Generic query helper biar balikan datanya type-safe
export const query = <T extends pg.QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<pg.QueryResult<T>> => {
    return pool.query<T>(text, params);
};