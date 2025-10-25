import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { CountriesService, ImageService } from './services';
import { CountryQueryDto } from './dto';
import { Response } from 'express';

@Controller('countries')
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly imageService: ImageService,
  ) {}

  @Post('refresh')
  refresh() {
    return this.countriesService.refresh();
  }

  @Get()
  list(@Query() query: CountryQueryDto) {
    return this.countriesService.list(query);
  }

  @Get('status')
  status() {
    return this.countriesService.status();
  }

  @Get('image')
  image(@Res() res: Response) {
    const image = this.imageService.fetchSummaryImage();
    res.send(image);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.countriesService.findOne(name);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.countriesService.remove(name);
  }
}
