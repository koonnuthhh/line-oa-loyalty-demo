import { Module } from '@nestjs/common';
import { VectorController } from './vector.controller';
import { VectorService } from './vector.service';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleSheetModule } from 'src/GoogleSheet/google-sheet.module';
import { SessionModule } from 'src/Usersession/session.module';

@Module({
  imports: [HotspotModule, HttpModule,GoogleSheetModule,SessionModule], 
  controllers: [VectorController],
  providers: [VectorService]
})
export class VectorModule {}
