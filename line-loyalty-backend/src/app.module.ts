import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VerdantModule } from './verdant/verdant.module';
import { HotspotModule } from './hotspot/hotspot.module';
import { NimbusModule} from './nimbus/nimbus.module';
import { AuroraModule } from './Aurora/Aurora.module';
import { GoogleSheetModule} from './GoogleSheet/google-sheet.module'
import { ZephyrService } from './zephyr/zephyr.service';
import { ZephyrController } from './zephyr/zephyr.controller';
import { MeridianModule } from './meridian/meridian.module';
import { ZephyrModule } from './zephyr/zephyr.module';
import { VectorService } from './vector/vector.service';
import { VectorController } from './vector/vector.controller';
import { VectorModule } from './vector/vector.module';
import { ConfigModule } from '@nestjs/config';
import { VerdantService } from './verdant/verdant.service';
import { LiffModule } from './liff/liff.module';
// Add this line to print the resolved static path when app starts
console.log('Static rootPath:', join(__dirname, '..', 'public'));

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    VerdantModule,
    HotspotModule,
    NimbusModule,
    AuroraModule,
    GoogleSheetModule,
    MeridianModule,
    ZephyrModule,
    VectorModule,
    LiffModule,
  ],
})
export class AppModule {}
