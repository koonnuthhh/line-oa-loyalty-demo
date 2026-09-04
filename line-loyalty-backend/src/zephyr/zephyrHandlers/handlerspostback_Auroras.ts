import { Client } from '@line/bot-sdk';
import { replyText } from '../../Utils/functions/replyFunction';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { handleOther } from './handelsOther';
import { SessionService } from 'src/Usersession/session.service';
import { JobApply } from 'src/Utils/functions/jobApplyFunction';


export async function handlePostbackMessage(
  client: Client,
  replyToken: string,
  action: string,
  item: string,
  params: Record<string, string>,
  hotspotService: HotspotService,
  userId: string,
  destination: string,
  //sessionService: SessionService
): Promise<void> {

  switch (action) {
    case 'JobApply':
                      await JobApply(client, replyToken, item);
                      break;
    case 'other':
      await handleOther(client, replyToken, item, params['message'] || '', userId, destination, hotspotService);


  }

}