import { Body, Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: any; // replace `any` with your user type if available
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: CreateUserDto) {
        console.log('register');
        return this.authService.registerUser(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        const { access_token, message } = await this.authService.loginUser(dto);
        // set cookie for clients that support it
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.IS_PRODUCTION === 'true',        // set to true in production (HTTPS)
            sameSite: process.env.IS_PRODUCTION === 'true' ? 'none' : 'lax',     // 'none' needed for cross-site XHR; production requires secure:true
            maxAge: 24 * 60 * 60 * 1000,
        });
        return { message, access_token };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: AuthenticatedRequest) {
        console.log('User:', req.user);
        return req.user;
    }
}
