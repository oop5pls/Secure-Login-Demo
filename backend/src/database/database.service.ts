import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
    public constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) { }

    public async query(queryText: string, params?: any[]) {
        try {
            const res = await this.pool.query(queryText, params);
            return res;
        } catch (err) {
            console.error('Database query failed: ', err);
            throw err;
        }
    }

    public async testConn() {
        console.log('Testing database connection...');
        try {
            const res = await this.pool.query('SELECT NOW()')
            return {
                success: true,
                message: 'Connected to Supabase!',
                time: res.rows[0]
            };
        } catch (err) {
            console.error('Database conn failed: ', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : String(err)
            };
        }
    }



}