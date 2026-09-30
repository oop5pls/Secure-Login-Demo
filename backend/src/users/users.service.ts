import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/database/database.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) { }

  async login(createUserDto: CreateUserDto) {
    if (!createUserDto.firstname || !createUserDto.surname || !createUserDto.password || !createUserDto.email) {
      throw new NotFoundException('All fields are required');
    }

    let user = await this.userRepository.FindOneByEmail(createUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    } else {
      const isMatch = await bcrypt.compare(createUserDto.password, user.password);


      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const payload = {
      sub: user.id,
      role: user.user_role
    };

    const token = this.jwtService.sign(payload);

    if (user.user_role === 'admin') {
      return { token: token, role: user.user_role };
    }
    return { token: token, role: user.user_role };
  }

  async register(createUserDto: CreateUserDto) {
    if (!createUserDto.firstname || !createUserDto.password || !createUserDto.surname || !createUserDto.email) {
      return false;
    }
    try {
      const creationResult = await this.userRepository.Create(createUserDto);
      console.log(creationResult);

      return { ok: true };

    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
        throw new ConflictException('An account with this email already exists');
      }
      throw error
    }
  }
}
