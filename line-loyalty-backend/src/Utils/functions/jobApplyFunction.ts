import client from "@line/bot-sdk/dist/client";
import { replyText } from "./replyFunction";



export const JobapplyOptions = ['สมัครงาน', 'ติดตามผลการสมัครงาน'];

export async function JobApply(
    client: client,
    replyToken: string,
    item: string,
) {
    switch (item) {
        case 'สมัครงาน': 
        await replyText(client, replyToken, 'กรอกฟอร์มสมัครงานได้ที่นี่: ');
        break;
        case 'ติดตามผลการสมัครงาน':
        await replyText(client, replyToken, 'กรุณาติดต่อฝ่ายบุคคลที่ (ยังไม่มีเบอร์) หรือทางอีเมล: (ยังไม่มีอีเมล)');
        break;
        default:
        await replyText(client, replyToken, 'ไม่พบตัวเลือกที่ท่านต้องการ');
    }
}