import { Client } from '@line/bot-sdk';
import { BASE_URL } from 'config/baseUrl.config';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function handleCheckInstallment(
  client: Client,
  userId: string,
  replyToken: string,
  params: Record<string, string>
) {
  const plate = params['plate'] || 'ไม่ทราบทะเบียน';
  const mockResponse = `ข้อมูลค่างวดของทะเบียน ${decodeURIComponent(plate)} คือ 5,400 บาท ค้าง 3 งวด ✅`;

  // ส่งข้อความหลัก 5 ข้อความก่อน
  await client.replyMessage(replyToken, [
    {
      type: 'text',
      text: mockResponse,
    },
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
      previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
    },
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
      previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
    },
    {
      type: 'image',
      originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
      previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
    },
  ]);

  // 🕓 รอ 5 วินาที
  await delay(5000);

  // ส่งภาพใบเสร็จหลัง delay
  if (userId) {
    await client.pushMessage(userId, [
      {
        type: 'text',
        text: 'ขอบคุณสำหรับการชำระเงิน ✅',
      },
      {
        type: 'image',
        originalContentUrl: `${BASE_URL}/assets/images/demo-image.svg`,
        previewImageUrl: `${BASE_URL}/assets/images/demo-image.svg`,
      },
    ]);
  }
}
