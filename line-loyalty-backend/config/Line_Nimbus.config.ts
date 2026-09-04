import { ClientConfig } from '@line/bot-sdk';
import * as dotenv from 'dotenv'; // ✅ Add this line

dotenv.config(); // ✅ Load .env manually at the top

if (!process.env.LINE_CHANNEL_ACCESS_TOKEN_NIMBUS || !process.env.LINE_CHANNEL_SECRET_NIMBUS) {
  console.error('LINE_CHANNEL_ACCESS_TOKEN or LINE_CHANNEL_SECRET not set');
  throw new Error('LINE credentials are missing in .env');
}

export const lineConfig_nimbus: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN_NIMBUS as string,
  channelSecret: process.env.LINE_CHANNEL_SECRET_NIMBUS as string,
};
