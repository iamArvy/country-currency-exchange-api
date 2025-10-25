import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CountryApiResponse } from '../dto';

@Injectable()
export class CountriesApiService {
  private logger = new Logger(CountriesApiService.name);
  private readonly url: string;

  constructor(private readonly config: ConfigService) {
    const apiUrl = this.config.get<string>('COUNTRIES_API_URL');
    if (!apiUrl) {
      throw new ServiceUnavailableException('COUNTRIES_API_URL is not defined');
    }
    this.url = apiUrl;
  }

  async fetchCountries(fields: string) {
    const url = `${this.url}/all?fields=${fields}`;
    const response = await axios
      .get<CountryApiResponse[]>(url, {
        timeout: 5000,
        timeoutErrorMessage: 'Request timed out',
      })
      .catch((error: Error) => {
        this.logger.error(error.message);
        throw new ServiceUnavailableException({
          message: 'Could not fetch data from Countries API',
          error: 'External data source unavailable',
        });
      });
    return response.data;
  }
}
