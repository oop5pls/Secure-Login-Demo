
import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleGuard } from './guards/auth-google.guard';
import { AuthGoogleService } from './auth-google.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'secret',
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    controllers: [AuthGoogleController],
    providers: [AuthGoogleService, AuthGoogleGuard, GoogleStrategy, JwtStrategy],
})
export class AuthGoogleModule { }


