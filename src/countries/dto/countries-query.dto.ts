import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export const sortFieldMap: Record<string, string> = {
  gdp: 'estimated_gdp',
  name: 'name',
  population: 'population',
  region: 'region',
};

export const sortOptions = Object.keys(sortFieldMap).flatMap((key) => [
  `${key}_asc`,
  `${key}_desc`,
]);

export class CountryQueryDto {
  @IsString()
  @IsOptional()
  region?: string;

  @IsString({ each: true })
  @IsOptional()
  currency?: string;

  @IsOptional()
  @IsInt()
  min_population?: number;

  @IsOptional()
  @IsInt()
  max_population?: number;

  @IsOptional()
  @IsInt()
  min_gdp?: number;

  @IsOptional()
  @IsInt()
  max_gdp?: number;

  @IsOptional()
  @IsIn(sortOptions, {
    message: `sort must be one of: ${sortOptions.join(', ')}`,
  })
  sort?: string;
}
