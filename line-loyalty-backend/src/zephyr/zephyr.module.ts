import { Module } from '@nestjs/common';
import { ZephyrController } from './zephyr.controller';
import { ZephyrService } from './zephyr.service';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleSheetModule } from 'src/GoogleSheet/google-sheet.module';
import { SessionModule } from 'src/Usersession/session.module';

@Module({
  imports: [HotspotModule, HttpModule,GoogleSheetModule,SessionModule], 
  controllers: [ZephyrController],
  providers: [ZephyrService]
})
export class ZephyrModule {}
