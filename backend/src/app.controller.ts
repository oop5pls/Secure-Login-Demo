import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService
  ) { }



  @Get('test-db')
  async testDb() {
    console.log('GET /test-db called');
    return await this.databaseService.testConn();
  }

}
