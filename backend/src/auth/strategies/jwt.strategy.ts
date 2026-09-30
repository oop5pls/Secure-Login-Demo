import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/database/database.repository';
import { UUID } from 'crypto';




export type JwtPayload = {
    sub: UUID,
    role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService,
        private userRepository: UserRepository
    ) {
        const extractJwtFromCookie = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['access_token'];
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        };
        super({
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
            jwtFromRequest: extractJwtFromCookie
        })
    }

    async validate(payload: JwtPayload) {
        const user = await this.userRepository.FindOne(payload.sub);

        if (!user) throw new UnauthorizedException('Please log in to continue');

        return {
            id: user.id,
            firstname: user.firstname,
            surname: user.surname,
            role: user.user_role
        };
    }
}