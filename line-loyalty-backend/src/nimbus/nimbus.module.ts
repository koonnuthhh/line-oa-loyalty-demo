import { Module } from '@nestjs/common';
import { NimbusController } from './nimbus.controller';
import { nimbusService } from './nimbus.service';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleSheetModule } from 'src/GoogleSheet/google-sheet.module';
import { SessionModule } from 'src/Usersession/session.module';

@Module({
  imports: [HotspotModule, HttpModule,GoogleSheetModule,SessionModule], 
  controllers: [NimbusController],
  providers: [nimbusService]
})
export class NimbusModule {}
