import { Client } from '@line/bot-sdk';
import { HttpService } from '@nestjs/axios';
import { replyText } from 'src/Utils/functions/replyFunction';
import { getCustomerSession, setCustomerSession, clearCustomerSession, setCustomerPassCache, getCustomerPassCache } from 'src/Utils/session/userSession.store';
import { getWiFi, spamGetWiFi } from 'src/Utils/api/hotspot.api';
import { BASE_URL } from 'config/baseUrl.config';

//const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 min for test
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// ENTRY FUNCTION
export async function handleCustomerAccess(client: Client, replyToken: string, userId: string, destination: string,): Promise<void> {

  // Store session awaiting branch input
  setCustomerSession(userId, {
    action: 'requestWifi',
    step: 'awaitingBranchId'
  });

    await client.replyMessage(replyToken, [
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
      previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
    },
    {
      type: 'text',
      text: "โปรดกรอกรหัสสาขา",
    },
]);
}

function isCacheValid(cached: { cachedAt: Date } | null | undefined): boolean {
  return !!cached && new Date().getTime() - cached.cachedAt.getTime() <= CACHE_EXPIRY_MS;
}

// CALLED AFTER USER TYPED BRANCH 
export async function handleCustomerBranchInput(
  httpService: HttpService,
  client: Client,
  replyToken: string,
  userId: string,
  destination: string,
  message: string,
): Promise<boolean> {
  const session = getCustomerSession(userId);

  if (session?.step === 'awaitingBranchId' && session.action === 'requestWifi') {
    clearCustomerSession(userId);
    const branchId = message.trim();
    const cacheKey = `${userId}:${branchId}`;
    const cached = getCustomerPassCache(cacheKey);

    // request Exceed 1 hr
    if (!isCacheValid(cached)) {
      try {
        const { username, password, Time } = await getWiFi(client, httpService, userId, destination, branchId);

        if (username && password) {
          setCustomerPassCache(cacheKey, { username, password, Time, cachedAt: new Date() });
          await replyText(client, replyToken, `Username: ${username}\nPassword: ${password}\n\nระยะเวลาจำกัดที่ใช้ได้: ${Time} หลังจากการขอครั้งแรก`);
        } else {
          await replyText(client, replyToken, 'ไม่พบ Username และ Password');
        }
      } catch (err: any) {
        console.error('getWiFi branch error:', err.message);
        await replyText(client, replyToken, 'สาขาไม่ถูกต้อง กรุณากดขอใหม่อีกครั้ง');
      }
    }

    // request Not Exceed 1 hr
    else {
      try {
        const allowed = await spamGetWiFi(client, httpService, userId, destination, branchId);

        if (allowed && cached) {
          await replyText(
            client,
            replyToken,
            `*Username: ${cached.username}\n*Password: ${cached.password}\n\n*ระยะเวลาจำกัดที่ใช้ได้: ${cached.Time} หลังจากการขอครั้งแรก`,
          );
        } else {
          await replyText(client, replyToken, 'ไม่สามารถ');
        }

      } catch (err: any) {
        console.error('spamGetWiFi error:', err.message);
        await replyText(client, replyToken, 'ไม่สามารถตรวจสอบข้อมูลได้ในขณะนี้ 😢');
      }
    }

    return true;
  }

  return false;
}