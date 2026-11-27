import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { databaseHelper } from '../common/helpers/database.helper';

@Module({
    imports: [
        PrismaModule,
    ],
    controllers: [
        ReservationController,
    ],
    providers: [
        ReservationService, databaseHelper
    ]
})
export class ReservationModule {}
