import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HotspotService } from './hotspot.service';


@Module({
  imports: [HttpModule],
  providers: [HotspotService],
  exports: [HotspotService],
})
export class HotspotModule {}
