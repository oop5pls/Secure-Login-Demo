import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import type { UUID } from 'crypto';
import { AdminRoleGuard } from './guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.adminService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.update(id, updateUserDto);
  }

  @Patch(':id')
  updatePartial(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.adminService.remove(id);
  }
}
