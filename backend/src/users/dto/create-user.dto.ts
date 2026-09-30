import { IsString, Length } from 'class-validator';

export class CreateUserDto {
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

    constructor(firstname: string, surname: string, password: string, email: string) {
        this.firstname = firstname;
        this.surname = surname;
        this.password = password;
        this.email = email;
    }
}
