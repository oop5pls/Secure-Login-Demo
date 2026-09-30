import {
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleGuard } from './guards/auth-google.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthGoogleController {
    constructor(private authService: AuthGoogleService) { }

    @Get('google')
    @UseGuards(AuthGoogleGuard)
    async auth() { }

    @Get('google/callback')
    @UseGuards(AuthGoogleGuard)
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        const { token, role } = await this.authService.signIn(req.user);

        console.log("user role: ", role);
        res.cookie('access_token', token, {
            maxAge: 2592000000,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        });

        if (role === 'admin') {
            return res.redirect('http://localhost:5173/admin')
        }

        return res.redirect('http://localhost:5173/welcome');
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req) {
        return req.user;
    }
}
