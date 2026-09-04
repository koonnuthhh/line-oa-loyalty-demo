import { Module } from '@nestjs/common';
import { VerdantService } from './verdant.service';
import { VerdantController } from './verdant.controller';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HotspotModule, HttpModule], 
  providers: [VerdantService],
  controllers: [VerdantController]
})
export class VerdantModule {}
