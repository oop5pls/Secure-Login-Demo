import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @Length(3, 30)
    firstname: string;

    @IsString()
    @Length(3, 30)
    surname: string;


    @IsString()
    @Length(3, 100)
    password: string;

    @IsString()
    @Length(3, 100)
    email: string;

    @IsString()
    @Length(3, 100)
    role: string;
}
