export const dbConfig = {
    host: import.meta.env.VITE_DB_HOST,
    port: import.meta.env.VITE_DB_PORT,
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PW,
    database: import.meta.env.VITE_DB_DB
}

import type { Client } from 'ts-postgres';

export async function checkUserToken(token: string | undefined, client: Client) {
    if (!token) {
        return null
    }

    const result = await client.query('SELECT * FROM users WHERE token = $1', [token]).one()
    return result?.get('name') ?? null
}