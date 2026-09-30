import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { UserRepository } from './database.repository';

@Global()
@Module(
    {
        providers: [
            DatabaseService,
            UserRepository,
            {
                provide: 'DATABASE_POOL',
                useFactory: (configService: ConfigService) => {
                    console.log('DATABASE_URL:', configService.get<string>('DATABASE_URL'));

                    try {
                        const pool = new Pool({
                            connectionString: configService.get<string>('DATABASE_URL'),

                            // ADD THIS BLOCK RIGHT HERE:
                            //change is prod
                            ssl: {
                                rejectUnauthorized: false,
                            }
                        });
                        console.log('Database pool created');

                        return pool;

                    } catch (err) {
                        console.log('Error creating database pool: ', err);

                    }

                },
                inject: [ConfigService]
            }
        ],
        exports: ['DATABASE_POOL', DatabaseService, UserRepository]
    }
)
export class DatabaseModule { }
