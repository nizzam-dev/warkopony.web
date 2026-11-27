import { Injectable, OnModuleInit, OnModuleDestroy,Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    
    private readonly logger = new Logger(PrismaService.name);

    constructor(){
        const ConnString = process.env.DATABASE_URL;

        if(!ConnString){
            throw new Error('DATABASE_URL is not configured')
        }

        const adapter = new PrismaPg(ConnString);

        super({adapter})
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('database disconnected');
    }
}
