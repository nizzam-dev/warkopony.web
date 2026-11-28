
import {
    ConflictException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }



    async createUser(
        name: string,
        email: string,
        password: string,
        role: Role = Role.KASIR,
    ) {
        email = email.trim().toLowerCase();

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email sudah digunakan');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return {
            status: 'success',
            data: user,
        };
    }

}
