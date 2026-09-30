import { CreateUserDto } from 'src/users/dto/create-user.dto';

export type User = {
    user: CreateUserDto;
};

export class UserList {
    list: User[] = [];
    constructor(id: number, user: CreateUserDto) {
        this.list.push({ user });
    }
}
