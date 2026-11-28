import { IsNotEmpty, IsString, Matches } from "class-validator";


export class getByCodeResrvationDto{
    @IsNotEmpty({message: 'kode kosong'})
    @IsString()
    @Matches(/^WK-[A-Z0-9]{4}-[A-Z0-9]{4}$/,{
        message: 'format tidak sesuai'
    })
    code!: string;
}