import client from "@line/bot-sdk/dist/client";
import { replyText } from "./replyFunction";



export const VerdantMoneyOptions = ['Mockup'];

export async function handleVerdantMoney(
    client: client,
    replyToken: string,
) {
    await replyText(client, replyToken, 'ขออภัย ระบบบริการ Verdant Money ยังไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง' );
}