import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { Prisma } from '@prisma/client';
import { CountryQueryDto, sortFieldMap } from '../dto/countries-query.dto';
import { CountriesApiService } from './countries-api.service';
import { ExchangeRatesApiService } from './exchange-rates-api.service';
import { ImageService } from './image.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CountriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly countriesApi: CountriesApiService,
    private readonly exchangeRatesApi: ExchangeRatesApiService,
    private readonly image: ImageService,
    private config: ConfigService,
  ) {}
  private logger = new Logger(CountriesService.name);

  private calculateGdp = (population: number, rate: number) => {
    return (
      (population * (Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000)) /
      rate
    );
  };

  async refresh() {
    const countries = await this.countriesApi.fetchCountries(
      'name,capital,region,population,flag,currencies',
    );
    const rates = await this.exchangeRatesApi.getExchangeRates('USD');
    const now = new Date();
    for (const country of countries) {
      const data: Prisma.CountryCreateInput = {
        name: country.name,
        capital: country.capital,
        population: country.population ?? 0,
        flag_url: country.flag,
        region: country.region,
        currency_code: null,
        exchange_rate: null,
        estimated_gdp: null,
        last_refreshed_at: now,
      };

      if (country.currencies && country.currencies.length > 0) {
        const code = country.currencies[0].code;
        const rate = rates[code];
        data.currency_code = code;
        data.exchange_rate = rate;
        data.estimated_gdp = this.calculateGdp(country.population, rate);
      }

      await this.prisma.country.upsert({
        where: { name: data.name },
        update: data,
        create: data,
      });
    }
    this.image.generateSummaryImage(now).catch((err) => {
      this.logger.error('Error generating summary image', err);
    });

    // await this.image.generateSummaryImage(now);
  }

  private filter(query: CountryQueryDto) {
    const where: Prisma.CountryWhereInput = {};
    if (query.region) where.region = query.region;
    if (query.currency) where.currency_code = query.currency;

    if (query?.min_population || query?.max_population) {
      where.population = {
        ...(query.min_population && { gte: Number(query.min_population) }),
        ...(query.max_population && { lte: Number(query.max_population) }),
      };
    }

    if (query?.min_gdp || query?.max_gdp) {
      where.estimated_gdp = {
        ...(query.min_gdp && { gte: Number(query.min_gdp) }),
        ...(query.max_gdp && { lte: Number(query.max_gdp) }),
      };
    }

    let orderBy: Prisma.CountryOrderByWithRelationInput | undefined;

    if (query.sort) {
      const [key, direction] = query.sort.split('_');
      const field = sortFieldMap[key];

      if (field && ['asc', 'desc'].includes(direction)) {
        orderBy = { [field]: direction as 'asc' | 'desc' };
      }
    }

    return { where, orderBy };
  }

  list(query: CountryQueryDto) {
    const filters = this.filter(query);
    return this.prisma.country.findMany(filters);
  }

  async findOne(name: string) {
    const country = await this.prisma.country.findUnique({
      where: { name },
    });
    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return country;
  }

  async remove(name: string) {
    const country = await this.prisma.country.findUnique({
      where: { name },
    });
    if (!country) throw new NotFoundException('Country not found');
    await this.prisma.country.delete({
      where: { name },
    });
  }

  async status() {
    const count = await this.prisma.country.count();
    const last = await this.prisma.country.findFirst({
      orderBy: { last_refreshed_at: 'desc' },
      select: { last_refreshed_at: true },
    });

    return {
      total_countries: count.toString(),
      last_refreshed_at: last?.last_refreshed_at,
    };
  }

  fetchImage() {
    return this.image.fetchSummaryImage();
  }
}
