import { Module } from '@nestjs/common';
import { Auroraervice } from './Aurora.service';
import { AuroraController } from './Aurora.controller';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';
import { SessionModule } from 'src/Usersession/session.module';
import { GoogleSheetModule } from 'src/GoogleSheet/google-sheet.module';


@Module({
  imports: [HotspotModule, HttpModule, GoogleSheetModule, SessionModule], 
  providers: [Auroraervice],
  controllers: [AuroraController]
})
export class AuroraModule {}
