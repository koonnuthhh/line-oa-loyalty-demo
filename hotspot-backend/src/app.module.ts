import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Sale } from 'src/entities/sale.entity';

import {
  Admin,
  Branch,
  Lineoa,
  Log,
  WifiCredential,
  WifiProfile,
  WifiUsage
} from './entities';

import { HotspotModule } from './hotspot/hotspot.module'; // Your custom module

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Log,
        Branch,
        Lineoa,
        Admin,
        WifiCredential,
        WifiProfile,
        WifiUsage,Sale,
      ],
      synchronize: false, // turn off in production
    }),
    TypeOrmModule.forFeature([
      Log,
      Branch,
      Lineoa,
      Admin,
      WifiCredential,
      WifiProfile,
      WifiUsage,
      Sale,
    ]),
    HotspotModule,
  ],
})
export class AppModule {}
