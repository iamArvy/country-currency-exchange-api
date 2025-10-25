import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ExchangeRatesApiResponse } from '../dto/exchange-rates-api-response.dto';

@Injectable()
export class ExchangeRatesApiService {
  private logger = new Logger(ExchangeRatesApiService.name);
  private readonly url: string;

  constructor(private readonly config: ConfigService) {
    const apiUrl = this.config.get<string>('EXCHANGE_RATES_API_URL');
    if (!apiUrl)
      throw new ServiceUnavailableException(
        'EXCHANGE_RATES_API_URL is not defined',
      );
    this.url = apiUrl;
  }

  async getExchangeRates(code: string) {
    const url = `${this.url}/${code}`;
    const response = await axios
      .get<ExchangeRatesApiResponse>(url, {
        timeout: 1500,
        timeoutErrorMessage: 'Request timed out',
      })
      .catch((error: Error) => {
        this.logger.error(error.message);
        throw new ServiceUnavailableException({
          message: 'Could not fetch data from Exchange Rates API',
          error: 'External data source unavailable',
        });
      });
    return response.data.rates;
  }
}
