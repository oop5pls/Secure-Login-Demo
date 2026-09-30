import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { AuthGoogleModule } from './auth/auth-google.module';


@Module({
  imports: [
    UsersModule,
    AdminModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthGoogleModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule { }
