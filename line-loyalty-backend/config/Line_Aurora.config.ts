import { ClientConfig } from '@line/bot-sdk';
import * as dotenv from 'dotenv'; // ✅ Add this line

dotenv.config(); // ✅ Load .env manually at the top

if (!process.env.LINE_CHANNEL_ACCESS_TOKEN_Aurora|| !process.env.LINE_CHANNEL_SECRET_Aurora) {
  console.error('LINE_CHANNEL_ACCESS_TOKEN or LINE_CHANNEL_SECRET not set');
  throw new Error('LINE credentials are missing in .env');
}

export const lineConfig_Angles: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN_Aurora as string,
  channelSecret: process.env.LINE_CHANNEL_SECRET_Aurora as string,
};
