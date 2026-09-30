import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { UserRepository } from 'src/database/database.repository';
import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/auth.dto';


@Injectable()
export class AuthGoogleService {
    constructor(
        private jwtService: JwtService,
        private userReporitory: UserRepository
    ) { }

    generateJwt(payload) {
        return this.jwtService.sign(payload);
    }

    async signIn(user: RegisterUserDto) {
        if (!user) {
            throw new BadRequestException('Unauthenticated')
        }


        let userExists = await this.findUserByEmail(user.google_id);

        console.log("reached google endpoint: ", userExists)
        if (!userExists) {
            const token = await this.registerUser(user)
            userExists = await this.findUserByEmail(user.google_id);
        }
        const token = this.generateJwt({
            sub: userExists.id,
            role: userExists.role
        });
        return { token: token, role: userExists.user_role };

    }

    async registerUser(user: RegisterUserDto) {
        try {
            const res = await this.userReporitory.CreateByMail(user)

            return res;

        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async findUserByEmail(email: string) {
        const user = await this.userReporitory.FindOneByMail(email);
        if (!user) {
            return null;
        }
        return user;
    }
}
