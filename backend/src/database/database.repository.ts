import { Injectable, Inject } from '@nestjs/common';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { UpdateAdminDto } from '../admin/dto/update-admin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { User, UserList } from '../users/entities/user.entity';
import { DatabaseService } from './database.service';
import { userInfo } from 'os';
import { RegisterUserDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';

@Injectable()
export class UserRepository {
    constructor(@Inject() private readonly databaseService: DatabaseService) { }

    async FindAll() {
        try {
            const res = await this.databaseService.query('SELECT * FROM users_table');
            return res.rows;
        } catch (err) {
            console.error('Database query failed: ', err);
            throw err;
        }
    }

    async FindOne(id: UUID) {
        try {
            const res = await this.databaseService.query('SELECT * FROM users_table WHERE id = $1', [id]);
            if (res.rows.length === 0) {
                throw new NotFoundException('No user found with the given id');
            }
            if (res.rows.length > 1) {
                throw new Error('Multiple users found with the same id');
            }
            return res.rows[0];
        } catch (err) {
            console.error('Database query failed: ', err);
            throw err;
        }
    }

    async Create(user: CreateUserDto) {

        try {
            const password = await bcrypt.hash(user.password, 10);
            const res = await this.databaseService.query(
                'INSERT INTO users_table (firstname, surname, password, email, gmail, user_role) VALUES ($1, $2, $3, $4, $5, $6)',
                [
                    user.firstname ?? (user as any).firstname,
                    user.surname ?? (user as any).surname,
                    password,
                    user.email ?? (user as any).email,
                    null,
                    'user'
                ]
            );

            return res;
        } catch (err) {
            console.error('Database query failed: ', err);
            throw err
        }
    }
    async CreateByMail(user: RegisterUserDto) {

        try {
            const res = await this.databaseService.query(
                'INSERT INTO users_table (firstname, surname, password, email, gmail,user_role) VALUES ($1, $2, $3, $4, $5, $6)',
                [
                    user.firstname ?? (user as any).firstname,
                    user.surname ?? (user as any).surname,
                    null, null, user.google_id ?? (user as any).google_id,
                    'user'
                ]
            );
            return res;
        } catch (err) {
            console.error('Database query failed: ', err);
            throw err
        }
    }


    async Update(id: UUID, user: UpdateUserDto) {
        try {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10)
            }
            const res = await this.databaseService.query(
                'UPDATE users_table SET firstname=$1, surname=$2, password=$3, email=$4 WHERE id=$5',
                [user.firstname,
                user.surname,
                user.password,
                user.email,
                    id]
            )
            return res;
        } catch (err) {
            console.error('Database query failed: ', err);
            throw err
        }
    }

    async Remove(id: UUID) {
        try {
            const res = await this.databaseService.query(
                'DELETE FROM users_table WHERE id=$1',
                [id]
            )
            return res;
        } catch (err) {
            console.error('Database query failed: ', err);
            throw err
        }
    }


    async FindOneByMail(email: string) {
        try {
            const res = await this.databaseService.query('SELECT * FROM users_table WHERE gmail = $1', [email]);
            if (res.rows.length === 0) {
                throw new NotFoundException('No user found with the given id');
            }
            if (res.rows.length > 1) {
                throw new Error('Multiple users found with the same id');
            }

            return res.rows[0];
        } catch (err) {
            console.error('Database query failed: ', err);
            return null;
        }
    }

    async FindOneByEmail(email: string) {
        try {
            const res = await this.databaseService.query('SELECT * FROM users_table WHERE email = $1', [email]);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (err) {
            console.error('Database query failed: ', err);
            return null;
        }
    }


}
