import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(){
        const ConnString = process.env.DATABASE_URL;

        if(!ConnString){
            throw new Error('DATABASE_URL is not configured')
        }

        const adapter = new PrismaPg(ConnString);

        super({adapter})
    }

    async onModuleInit() {
        await this.$connect()
        console.log('database connected')
    }

    async onModuleDestroy() {
        await this.$disconnect()
        console.log('database disconnected')
    }
}
