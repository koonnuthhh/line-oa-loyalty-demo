import { Client } from '@line/bot-sdk';
import { replyFlex, replyText } from '../../Utils/functions/replyFunction';
import { getButtonOptionsFlexContent, websiteCarouselFlexContent } from 'src/Utils/functions/flexMessage';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { BASE_URL } from 'config/baseUrl.config';
import { JobapplyOptions } from 'src/Utils/functions/jobApplyFunction';

export async function handleOther(
  client: Client,
  replyToken: string,
  item: string,
  message: string,
  userId: string,
  destination: string,
  hotspotService: HotspotService
): Promise<void> {
  switch (item) {
    case 'ช่องทางการติดต่อ': {
      await replyText(client, replyToken, 'เบอร์ติดต่อ: 097-395-5151\n\nช่องทางการติดต่อเพิ่มเติม: ');
      return;
    }

    case 'สมัครงาน': {
              const flex = getButtonOptionsFlexContent(
                              'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                              JobapplyOptions.map((label) => ({
                                  label,
                                  postbackData: `action=JobApply&item=${encodeURIComponent(label)}`
                              }))
                          );
              await replyFlex(client,replyToken, flex);
              //await replyText(client, replyToken, 'กรอกฟอร์มสมัครงานได้ที่นี่: ');
              return;
            }
    case 'ขอรหัส wi-fi': {
      await hotspotService.handleWifiRequest(userId, destination, client, replyToken);
      return;
    }

    case 'บริจาคเงินช่วยเหลือเด็กๆ': {
      const message = websiteCarouselFlexContent('ข้อมูลผลิตภัณฑ์', [
        {
          title: 'บริจาคเงินช่วยเหลือน้ำท่วม',
          imageUrl: ``,
          location: 'หมวดหมู่: น้ำท่วม',
          url: `${BASE_URL}/assets/images/demo-image.svg`,
        },
        {
          title: 'บริจาคเงินช่วยเหลือเด็กๆ',
          imageUrl: ``,
          location: 'หมวดหมู่: ช่วยเหลือเด็กๆ',
          url: `${BASE_URL}/assets/images/demo-image.svg`,
        },
        {
          title: 'บริจาคอื่นๆ',
          imageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
          location: 'หมวดหมู่: อื่นๆ',
          url: `${BASE_URL}/assets/images/demo-image.svg`,
        },
      ]);
      await client.replyMessage(replyToken, [
        {
          type: 'image',
          originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
          previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
        },
        {
          type: 'text',
          text: 'ขอบคุณสำหรับการสนับสนุน',
        },
        message,
      ]);
      return;
    }

    case 'แบบประเมินความพึงพอใจ': {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: `Put google form link here`,
      });
      return;
    }

    case 'อื่นๆ': {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: `ท่านสามารถขอรับบริการเพิ่มเติมจากเจ้าหน้าที่ผ่านเบอร์ติดต่อ: 097-395-5151`,
      });
      return;
    }
     case 'แบบประเมินความพึงพอใจ': {
      await replyText(client, replyToken, 'สามารถกรอกแบบประเมินความพึงพอใจได้ที่: ');
      return;
    }

    default: {
      await client.replyMessage(replyToken, {
        type: 'text',
        text: 'ไม่สามารถระบุคำสั่งได้ 😢',
      });
      return;
    }
  }
}
