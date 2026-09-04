import { Module } from '@nestjs/common';
import { LiffController } from './liff.controller';
import { LiffService } from './liff.service';
import { HotspotModule } from 'src/hotspot/hotspot.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
  controllers: [LiffController],
  providers: [LiffService]
})
export class LiffModule {}
