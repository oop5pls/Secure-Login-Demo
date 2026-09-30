import { IsString, Length } from 'class-validator';
export class RegisterUserDto {
    @IsString()
    @Length(3, 30)
    firstname: string;

    @IsString()
    @Length(3, 30)
    surname: string;


    @IsString()
    @Length(3, 100)
    google_id: string;
}