import { Module } from '@nestjs/common';
import { MeridianController } from './meridian.controller';
import { MeridianService } from './meridian.service';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleSheetModule } from 'src/GoogleSheet/google-sheet.module';
import { SessionModule } from 'src/Usersession/session.module';

@Module({
  imports: [HotspotModule, HttpModule,GoogleSheetModule,SessionModule], 
  controllers: [MeridianController],
  providers: [MeridianService]
})
export class MeridianModule {}
