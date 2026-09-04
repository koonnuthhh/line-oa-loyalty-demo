import { Client } from '@line/bot-sdk';
import { replyFlex, replyText } from '../../Utils/functions/replyFunction';
import { handleServiceCenter } from './handleServiceCenter';
import { handleOther } from './handleOther';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { handleChooseProduct } from './handleChooseProduct';
import { handleTestDrive } from './handleTestDrive';
import { handleChoosePromotion } from './handlePromotion';
import { JobApply } from 'src/Utils/functions/jobApplyFunction';
import { handleVerdantMoney } from 'src/Utils/functions/VerdantMoney';

export async function handlePostbackMessage(
  client: Client,
  replyToken: string,
  action: string,
  item: string,
  params: Record<string, string>,
  hotspotService: HotspotService,
  userId: string,
  destination: string,
): Promise<void> {
  switch (action) {

    case 'ChooseProduct':
      await handleChooseProduct(client , replyToken, item);
      break;

    case 'serviceCenter':
      await handleServiceCenter(client, replyToken, item, userId);
      break;

    case 'test-drive':
      await handleTestDrive(client, replyToken, item,(token, flex) => replyFlex(client, token, flex));
      break;

    case 'Promotion':
      await handleChoosePromotion(client, replyToken, item);
      break;

    case 'other':
      await handleOther(
        client,
        replyToken,
        item,
        params['message'] || '',
        userId,
        destination,
        hotspotService,
      );
      break;
      
    case 'VerdantMoney':
      await handleVerdantMoney(client, replyToken);
      break;
      
    case 'JobApply':
      await JobApply(client, replyToken, item);
      break;
      
    case 'แบบประเมินความพึงพอใจ': {
      await replyText(client, replyToken, 'สามารถกรอกแบบประเมินความพึงพอใจได้ที่: ');
      return;
    }

    default:
      await replyText(client, replyToken, 'คำสั่งไม่ถูกต้อง');
      break;
  }
}
