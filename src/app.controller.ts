// src/boxes/boxes.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  async app() {
    return 'Hello world!';
  }
}
