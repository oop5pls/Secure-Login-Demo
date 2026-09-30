import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg'

@Injectable()
export class AppService {

  public getHello(): string {
    console.log('Hello World!');
    return 'Hello World!';
  }


}
