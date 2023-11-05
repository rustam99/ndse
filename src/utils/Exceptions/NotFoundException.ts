import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor() {
    super('Not_Found', HttpStatus.NOT_FOUND);
  }
}
