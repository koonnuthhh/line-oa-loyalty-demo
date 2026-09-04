import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import 'dotenv/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Capture the raw request body: LINE webhook signature validation needs the
  // exact bytes LINE signed, not the re-serialized JSON.
  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.enableCors();

  // ✅ Correctly resolves to project root/views (works in ts-node dev AND compiled prod)
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT || 9876); 
}
bootstrap();


