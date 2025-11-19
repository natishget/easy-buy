import { Body, Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


interface AuthenticatedRequest extends Request {
    user: any; // or better, use a specific type for user if you have one
  }

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: CreateUserDto) {
        console.log("register")
        return this.authService.registerUser(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res({passthrough: true}) res: Response) {
        const {access_token, message} = await this.authService.loginUser(dto);
        console.log("login", access_token)
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false, // use `true` in production with HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return {message};
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: AuthenticatedRequest) {
        console.log('User:', req.user);
        return req.user;
    }
} 
