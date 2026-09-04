import { Client } from '@line/bot-sdk';
import moment from 'moment';
import { GoogleSheetService } from 'src/GoogleSheet/google-sheet.service';
import { HotspotService } from 'src/hotspot/hotspot.service';
export async function handleAdminStatusUpdate(
  client: Client,
  replyToken: string,
  message: string,
  destination: string,
  brand: string,
  services: {
    googleSheetsService: GoogleSheetService;
  }
): Promise<boolean> {
  const { googleSheetsService } = services;

  const match = message.match(/^(accept|done|cancel|reject)\s+(\d+)$/i);
  if (!match) return false;

  const statusMap: Record<string, string> = {
    accept: 'ยืนยันการจอง',
    done: 'เสร็จสิ้น',
    cancel: 'ยกเลิก',
    reject: 'ปฏิเสธ',
  };

  const command = match[1].toLowerCase();
  const bookingId = parseInt(match[2], 10);
  const newStatus = statusMap[command];

  if (!newStatus) {
    await client.replyMessage(replyToken, {
      type: 'text',
      text: `ไม่รู้จักคำสั่ง: ${command}`,
    });
    return true;
  }

  try {
    // ✅ Update status and get row
    const updatedRow = await googleSheetsService.updateStatusByBookingIdFast(
      brand,
      bookingId,
      newStatus
    );

    const customerUid = updatedRow['Customer Line UID'];
    const car = updatedRow['กรุณาเลือกรถยนต์ที่ท่านต้องการทดลองขับ'] || '';
    const branch = updatedRow['สาขาที่ต้องการทดลองขับ'] || '';
    const datetime = updatedRow['วันเวลาที่นัดหมาย\n(ตั้งแต่เวลา 9:00-17:00 น. หยุดทุกวันอาทิตย์)'] || '';
    const lineoaUid = updatedRow['lineOA_id'] || '';
    const Ticketid = updatedRow['หมายเลขการจอง'];

    // ✅ Reply to admin
    await client.replyMessage(replyToken, {
      type: 'text',
      text: `✅ อัปเดตหมายเลขการจอง ${Ticketid} เป็น "${newStatus}" แล้ว`,
    });

      const messageToUser =
`📌 การจองของคุณได้รับการยืนยันแล้ว:
รถที่ต้องการทดลอง: ${car}
สาขา: ${branch}
วันเวลา: ${datetime}
สถานะใหม่: ${newStatus}

ขอบคุณที่ใช้บริการ 🙏`;

      await client.pushMessage(customerUid, {
        type: 'text',
        text: messageToUser,
      });
    

    return true;
  } catch (error) {
    console.error('❌ Error updating status:', error);
    await client.replyMessage(replyToken, {
      type: 'text',
      text: `เกิดข้อผิดพลาด: ${error.message}`,
    });
    return true;
  }
}
