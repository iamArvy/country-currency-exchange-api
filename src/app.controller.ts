import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries/services';

@Controller()
export class AppController {
  constructor(private readonly countryService: CountriesService) {}

  @Get('status')
  status() {
    return this.countryService.status();
  }
}
