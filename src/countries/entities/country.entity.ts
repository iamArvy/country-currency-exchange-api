export class Country {
  id: number;
  name: string;
  capital: string | null;
  region: string | null;
  population: number;
  currency_code: string;
  exchange_rate: number;
  estimated_gdp: number;
  flag_url: string | null;
  last_refreshed_at: Date;
}

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

// generator client {
//   provider = "prisma-client"
// }

// datasource db {
//   provider = "mysql"
//   url      = env("DATABASE_URL")
// }

// model Country {
//   id                Int      @id @default(autoincrement())
//   name              String   @unique
//   capital           String?
//   region            String?
//   population        BigInt
//   currency_code     String
//   exchange_rate     Float
//   estimated_gdp     Float
//   flag_url          String?
//   last_refreshed_at DateTime @updatedAt

//   @@map("countries")
// }
