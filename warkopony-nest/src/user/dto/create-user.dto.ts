
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';

import { Role } from '../../generated/prisma/client';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @IsEmail()
    @MaxLength(255)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(72)
    password!: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
