import { Controller, HttpCode, HttpException, Put, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersGuard } from './users.guard';
import type { Response } from 'express';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/login')
  async login(@Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { token, role } = await this.usersService.login(createUserDto);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    return { role }
  }
  @Post('/register')
  register(@Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto)
  }

  @Post('/oauth')
  loginOauth() {

    return {}
  }

  @Get()
  loadPage() {
    console.log('hello world!')
    return true;
  }

  /*
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  */

  /*
  @Put(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({ transform: true })) updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
 
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  */
}
