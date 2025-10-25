class Currency {
  code: string;
  name: string;
  symbol: string;
}

export class CountryApiResponse {
  name: string;
  capital: string;
  population: number;
  flag: string;
  region: string;
  currencies: Currency[];
}
