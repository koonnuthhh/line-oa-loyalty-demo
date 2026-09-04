import { Client } from '@line/bot-sdk';
import { HttpService } from '@nestjs/axios';
import { hotspotAPIConfig } from 'config/hotspotAPI.config';
import { getAdminSession, clearAdminSession, setAdminSession } from 'src/Utils/session/userSession.store';
import { resetWifi, getUsageLog } from 'src/Utils/api/hotspot.api';
import { replyText } from 'src/Utils/functions/replyFunction';
import { getButtonOptionsFlexContent } from 'src/Utils/functions/flexMessage';
import { handleCustomerAccess } from './handleCustomerAccess';

// ENTRY FUNCTION
export async function handleAdminAccess(
  client: Client,
  replyToken: string
) {
  const flex = getButtonOptionsFlexContent(
    'Admin Wi-Fi Access',
    [
      {
        label: 'ดูประวัติการใช้งาน',
        postbackData: 'action=usageLog',
      },
      {
        label: 'รีเซ็ตรหัส Wi-Fi',
        postbackData: 'action=resetWifi',
      },
      {
        label: 'ขอรหัส Wi-Fi',
        postbackData: 'action=getWifi',
      },
    ]
  );

  await client.replyMessage(replyToken, flex);
}


// handle postback option
export async function handleAdminOption(
  client: Client,
  replyToken: string,
  userId: string,
  destination: string,
  action: 'usageLog' | 'resetWifi'
): Promise<void> {
  setAdminSession(userId, {
    action,
    step: 'awaitingBranchId',
  });

  let prompt = '';

  switch (action) {
    case 'usageLog':
      prompt =
        '📊 โปรดกรอกรหัสสาขาที่ต้องการดูประวัติ\n\n- พิมพ์รหัสสาขา หรือ\n- พิมพ์ all เพื่อดูทุกสาขา';
      break;
    case 'resetWifi':
      prompt =
        '🔐 โปรดกรอกรหัสสาขาที่ต้องการรีเซ็ต Wi-Fi\n\n- พิมพ์รหัสสาขา หรือ\n- พิมพ์ all เพื่อรีเซ็ตทุกสาขา';
      break;
  }

  await replyText(client, replyToken, prompt);
}



export async function handleAdminBranchInput(
  httpService: HttpService,
  client: Client,
  replyToken: string,
  userId: string,
  destination: string,
  message: string
): Promise<boolean> {
  const session = getAdminSession(userId);
  if (!session || session.step !== 'awaitingBranchId') return false;

  clearAdminSession(userId);

  const branchId = message.trim();
  const url = hotspotAPIConfig.hotspotURL;

  try {
    if (session.action === 'usageLog') {
      await getUsageLog(client, replyToken, httpService, url, userId, destination, branchId);
    } else if (session.action === 'resetWifi') {
      await resetWifi(client, replyToken, httpService, url, userId, destination, branchId);
    }
  } catch (err: any) {
    console.error(`Admin branch input error:`, err.message);
    await replyText(client, replyToken, 'เกิดข้อผิดพลาดในการประมวลผล โปรดลองใหม่ภายหลัง');
  }

  return true;
}