import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  isAlive(): string {
    return 'API is alive';
  }
}
