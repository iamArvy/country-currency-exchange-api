import { Global, Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import {
  CountriesApiService,
  CountriesService,
  ExchangeRatesApiService,
  ImageService,
} from './services';

@Global()
@Module({
  controllers: [CountriesController],
  providers: [
    CountriesApiService,
    ExchangeRatesApiService,
    ImageService,
    CountriesService,
  ],
  exports: [CountriesService],
})
export class CountriesModule {}
