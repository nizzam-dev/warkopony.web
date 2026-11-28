import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { randomBytes } from 'node:crypto';
import { getByCodeResrvationDto } from './dto/getByCode-reservation.dto';
import { formatUtils } from '../common/utils/format.utils';
import { databaseHelper } from '../common/helpers/database.helper';
import { Prisma } from '../generated/prisma/client';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Injectable()
export class ReservationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly dbHelper: databaseHelper
    ) { }

    async createReservation(dto: CreateReservationDto) {
        const reservationAt = new Date(dto.reservationAt);

        const now = Date.now();
        const earliestReservation = now + 3 * 60 * 60 * 1000;
        const latestReservation = now + 7 * 24 * 60 * 60 * 1000;

        if (reservationAt.getTime() < earliestReservation) {
            throw new BadRequestException(
                'Reservasi harus dibuat minimal 3 jam sebelum waktu kedatangan.',
            );
        }
        if (reservationAt.getTime() > latestReservation) {
            throw new BadRequestException(
                'Reservasi hanya dapat dibuat maksimal 7 hari ke depan.',
            );
        }

        const bookingCode = `WK-${randomBytes(2).toString('hex').toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;

        const reservation = await this.prisma.reservation.create({
            data: {
                bookingCode: bookingCode,
                name: dto.name,
                phone: dto.phone,
                reservationAt,
                guestCount: dto.guestCount,
            },
        });

        const formatedDate = formatUtils.formatDate(reservation.reservationAt);

        const message = `Halo Warkopony!
Saya ingin melakukan reservasi.

Booking Code: ${reservation.bookingCode}
Nama: ${reservation.name}
Nomor HP: ${reservation.phone}
Tanggal Reservasi: ${formatedDate}
Jumlah Tamu: ${reservation.guestCount}

Mohon konfirmasi reservasi saya.
Terima kasih!
*NOTE: JIKA PESAN TIDAK DIKIRIM OLEH PELANGGAN/PESAN TIDAK MASUK KE KASIR, MAKA DINYATAKAN BATAL*
        `;

        const phoneLink = process.env.WHATSAPP_NUMBER;
        const encMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneLink}?text=${encMessage}`

        return {
            status: 'success',
            // code: bookingCode,
            url: url,
        };
    }

    async readReservation() {

        const reservation = await this.prisma.reservation.findMany();
        return {
            status: 'success',
            data: reservation,
        }
    }

    async readReservationByCode(dto: getByCodeResrvationDto) {
        const reservation = await this.dbHelper.searchTable('reservation', 'findUnique', 'bookingCode', dto.code);
        if (!reservation) {
            throw new NotFoundException('code tidak ditemukan');
        }
        
        const formatedDate = formatUtils.formatDate(reservation.reservationAt);

        return {
            status: 'success',
            data: {
                name: reservation.name,
                code: reservation.bookingCode,
                guests: reservation.guestCount,
                // phone: reservation.phone,
                date: formatedDate,
                status: reservation.status,
            },
        }
    }


    async updateReservationStatus(
        id: string,
        dto: UpdateReservationStatusDto,
    ) {
        try {
            const reservation = await this.prisma.reservation.update({
                where: { id },
                data: {
                    status: dto.status,
                },
                select: {
                    id: true,
                    bookingCode: true,
                    status: true,
                },
            });

            return {
                status: 'success',
                message: 'Status reservasi berhasil diperbarui',
                data: reservation,
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException('Reservasi tidak ditemukan');
            }

            throw error;
        }
    }


}
