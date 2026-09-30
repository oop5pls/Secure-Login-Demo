import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserRepository } from '../database/database.repository';
import { DatabaseService } from 'src/database/database.service';
import { AdminRoleGuard } from './guards/admin.guard';

@Module({
  controllers: [AdminController],
  providers: [AdminService, UserRepository, DatabaseService, AdminRoleGuard],
})
export class AdminModule { }