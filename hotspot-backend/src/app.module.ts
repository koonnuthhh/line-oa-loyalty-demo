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
import { DemoSeedService } from './demo-seed.service';

const ENTITIES = [
  Log,
  Branch,
  Lineoa,
  Admin,
  WifiCredential,
  WifiProfile,
  WifiUsage,
  Sale,
];

/** DB_MODE=demo  ->  in-memory SQLite, auto-created & seeded (no database server). */
const isDemoMode = process.env.DB_MODE === 'demo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(
      isDemoMode
        ? {
            type: 'sqlite',
            database: ':memory:',
            entities: ENTITIES,
            synchronize: true,
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ENTITIES,
            synchronize: false, // turn off in production
          },
    ),
    TypeOrmModule.forFeature(ENTITIES),
    HotspotModule,
  ],
  providers: [DemoSeedService],
})
export class AppModule {}
