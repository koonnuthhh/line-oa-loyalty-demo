import { Client, TextMessage, ImageMessage } from '@line/bot-sdk';
import { getLocationRequestFlex } from '../../Utils/functions/flexMessage';
import { BASE_URL } from 'config/baseUrl.config';

export async function handleServiceCenter(
  client: Client,
  replyToken: string,
  item: string
) {
  switch (item) {
    //case 'ศูนย์บริการใกล้ฉัน':
    case 'ศูนย์บริการใกล้ฉัน': {
      const imageMsg: ImageMessage = {
        type: 'image',
        originalContentUrl: `${BASE_URL}/assets/images/demo-image.png`,
        previewImageUrl: `${BASE_URL}/assets/images/demo-image.png`,
      };

      const textMsg: TextMessage = {
        type: 'text',
        text: `คุณเลือกบริการ: ${item}`,
      };

      const flexMsg = getLocationRequestFlex();

      await client.replyMessage(replyToken, [imageMsg, textMsg, flexMsg]);
      return;
    }


    default:
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'ไม่สามารถระบุคำสั่งได้ 😢',
      });
      return;
  }
}
