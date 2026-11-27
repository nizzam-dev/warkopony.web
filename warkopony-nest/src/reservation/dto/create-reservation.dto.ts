import {
  IsString,
  IsNotEmpty,
  IsDateString,
  Min,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;

  @IsDateString()
  @IsNotEmpty()
  reservationAt!: string;

  @IsInt()
  @Min(1)
  guestCount!: number;
}
