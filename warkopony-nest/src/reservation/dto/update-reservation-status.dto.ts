
import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../../generated/prisma/client';

export class UpdateReservationStatusDto {
    @IsEnum(ReservationStatus)
    status!: ReservationStatus;
}
