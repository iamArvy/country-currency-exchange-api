import { Module } from '@nestjs/common';
import { CountriesModule } from './countries/countries.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CountriesModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
