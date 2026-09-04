import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HotspotService } from './hotspot.service';
import { HotspotController } from './hotspot.controller';

import { Admin } from '../entities/admin.entity';
import { Branch } from '../entities/branch.entity'; // ✅ Import Branch entity
import { WifiUsage } from '../entities/wifi-usage.entity';
import { WifiCredential } from '../entities/wifi-credential.entity';
import { Lineoa, Log } from 'src/entities';
import { Sale } from 'src/entities/sale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Branch,
      Lineoa,
      Log, // ✅ Register Branch for injection
      WifiUsage,
      WifiCredential,
      Sale,
    ]),
  ],
  providers: [HotspotService],
  controllers: [HotspotController],
})
export class HotspotModule {}
