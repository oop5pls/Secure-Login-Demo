import { Injectable, Inject } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { User, UserList } from '../users/entities/user.entity';
import { UserRepository } from 'src/database/database.repository';
import { UUID } from 'crypto';

@Injectable()
export class AdminService {
  constructor(@Inject() private readonly userrepo: UserRepository) {
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userrepo.Create(createUserDto)
    } catch (err) {
      console.log('Error occured upon creation', err);
      throw err;
    }
  }

  async findAll() {
    const rows = await this.userrepo.FindAll();
    return (rows ?? []).map((row: any) => row);
  }

  async findOne(id: UUID) {
    const user = await this.userrepo.FindOne(id);
    return user
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    return await this.userrepo.Update(id, updateUserDto);

  }

  async remove(id: UUID) {
    return await this.userrepo.Remove(id);
  }
}
