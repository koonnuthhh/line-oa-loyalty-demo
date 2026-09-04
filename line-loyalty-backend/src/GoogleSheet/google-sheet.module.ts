import { Module, Global } from '@nestjs/common';
import { GoogleSheetService } from './google-sheet.service';
import { ConfigModule } from '@nestjs/config';

@Global() // Optional: makes the service globally available
@Module({
  imports: [ConfigModule], // needed for ConfigService
  providers: [GoogleSheetService],
  exports: [GoogleSheetService], // make it reusable in other modules
})
export class GoogleSheetModule {}
