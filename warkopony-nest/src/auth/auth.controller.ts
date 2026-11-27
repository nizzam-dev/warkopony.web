
import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Throttle({
        default: {
            limit: 5,
            ttl: 60000,
        },
    })
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(
            dto.email,
            dto.password,
        );
    }
}
