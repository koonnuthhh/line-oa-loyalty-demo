import { Client, TextMessage, ImageMessage } from '@line/bot-sdk';
import { getLocationRequestFlex } from '../../Utils/functions/flexMessage';
import { BASE_URL } from 'config/baseUrl.config';

export async function handleServiceCenter(
  client: Client,
  replyToken: string,
  item: string
) {
  switch (item) {
    case 'ศูนย์บริการใกล้ฉัน':
    case 'ตรอ. ใกล้ฉัน': {
      const imageMsg: ImageMessage = {
        type: 'image',
        originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
        previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
      };

      const textMsg: TextMessage = {
        type: 'text',
        text: `คุณเลือกบริการ: ${item}`,
      };

      const flexMsg = getLocationRequestFlex();

      await client.replyMessage(replyToken, [imageMsg, textMsg, flexMsg]);
      return;
    }


    case 'โปรโมชั่นศูนย์บริการ': {
      await client.replyMessage(replyToken, [
        {
          type: 'image',
          originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
          previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
        },
      ]);
      return true;
    }

    default:
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'ไม่สามารถระบุคำสั่งได้ 😢',
      });
      return;
  }
}
