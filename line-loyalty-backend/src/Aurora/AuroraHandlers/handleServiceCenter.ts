import { Client, ImageMessage, TextMessage } from '@line/bot-sdk';
import { getButtonOptionsFlexContent, getLocationRequestFlex } from '../../Utils/functions/flexMessage';
import { BASE_URL } from 'config/baseUrl.config';
import { userLocationPreferenceMap } from '../Aurora.service';
import { replyFlex } from 'src/Utils/functions/replyFunction';
import { serviceCenterOptions } from 'src/data/serviceCenterOptions';



export async function handleServiceCenter(
  client: Client,
  replyToken: string,
  item: string,
  userId: string,
) {
  const items = item.split('-');
  switch (item) {

    //give user option to choose service or repair
    case 'NIMBUS':
      await replyFlex(client, replyToken,getButtonOptionsFlexContent(
        'กรุณาเลือกงานบริการ',
        serviceCenterOptions.map((label) => ({
          label,
          postbackData: `action=serviceCenter&item=NIMBUS-${encodeURIComponent(label)}`
        }))
      ));
      return true;

    case 'VECTOR':
      await replyFlex(client, replyToken,getButtonOptionsFlexContent(
        'กรุณาเลือกงานบริการ',
        serviceCenterOptions.map((label) => ({
          label,
          postbackData: `action=serviceCenter&item=VECTOR-${encodeURIComponent(label)}`
        }))
      ));
      return true;

    case 'MERIDIAN':
      await replyFlex(client, replyToken,getButtonOptionsFlexContent(
        'กรุณาเลือกงานบริการ',
        serviceCenterOptions.map((label) => ({
          label,
          postbackData: `action=serviceCenter&item=MERIDIAN-${encodeURIComponent(label)}`
        }))
      ));
      return true;

    case 'ZEPHYR':
      await replyFlex(client, replyToken,getButtonOptionsFlexContent(
        'กรุณาเลือกงานบริการ',
        serviceCenterOptions.map((label) => ({
          label,
          postbackData: `action=serviceCenter&item=ZEPHYR-${encodeURIComponent(label)}`
        }))
      ));
      return true;


      // Handle choose service center location
      case 'NIMBUS-ค้นหาศูนย์บริการ':
        userLocationPreferenceMap.set(userId, 'NIMBUS');
        break;
      case 'VECTOR-ค้นหาศูนย์บริการ':
        userLocationPreferenceMap.set(userId, 'VECTOR');
        break;
      case 'MERIDIAN-ค้นหาศูนย์บริการ':
        userLocationPreferenceMap.set(userId, 'MERIDIAN');
        break;
      case 'ZEPHYR-ค้นหาศูนย์บริการ':
        userLocationPreferenceMap.set(userId, 'ZEPHYR');
        break;

      // Handle repair request
    // case 'NIMBUS-แจ้งซ่อมรถยนต์':
    //   await client.replyMessage(replyToken, {
    //     type: 'text',
    //     text: 'คุณเลือกบริการแจ้งซ่อมรถยนต์ นิมบัส ออโรร่า กรุณาแจ้งหมายเลขทะเบียนรถยนต์ของคุณ*ระบบยังไม่พร้อมใช้งาน*',
    //   });
    //   break;



    default:
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'งานบริการซ่อมยังไม่พร้อมใช้งานในขณะนี้ กรุณาลองอีกครั้งในภายหลัง',
      });
      break;
  }

  if (items[1]  === 'ค้นหาศูนย์บริการ') {
  const flexMsg = getLocationRequestFlex();
  const imageMsg: ImageMessage = {
    type: 'image',
    originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
    previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
  };

  await client.replyMessage(replyToken, [imageMsg, flexMsg]);
}
  return;
}
