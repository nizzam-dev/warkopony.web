import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { getByCodeResrvationDto } from './dto/getByCode-reservation.dto'; import { Patch, ParseUUIDPipe } from '@nestjs/common';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';


@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    @Throttle({
        default: {
            limit: 10,
            ttl: 60000,
        },
    })
    @Post()
    createReservation(@Body() dto: CreateReservationDto) {
        return this.reservationService.createReservation(dto);
    }
    // @Get()
    // getAll() {
    //     return this.reservationService.readReservation();
    // }
    @Get(':code')
    getByCode(@Param() dto: getByCodeResrvationDto) {
        return this.reservationService.readReservationByCode(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'KASIR')
    @Patch(':id/status')
    updateReservationStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateReservationStatusDto,
    ) {
        return this.reservationService.updateReservationStatus(id, dto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'KASIR')
    @Get()
    async getAll() {
        return this.reservationService.readReservation();
    }


}
