import client from "@line/bot-sdk/dist/client";
import { replyText } from "./replyFunction";
import { websiteCarouselFlexContent } from "./flexMessage";
import { BASE_URL } from "config/baseUrl.config";
const productOptions = ['ดูข้อมูลผลิตภัณฑ์', 'ซื้อผลิตภัณฑ์']

export async function productChooseOptions(
    client: client,
    replyToken: string,
    item: string,
) {
    switch (item) {
        case 'ดูข้อมูลผลิตภัณฑ์': {
            const message = websiteCarouselFlexContent('ข้อมูลผลิตภัณฑ์', [
                {
                    title: 'Verdant',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: verdant',
                    url: '',
                },
                {
                    title: 'Verdantmoney',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: verdantmoney',
                    url: '',
                },
                {
                    title: 'Cubhouse',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: cubhouse',
                    url: '',
                },
                {
                    title: 'Bigwing',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: bigwing',
                    url: '',
                },
                {
                    title: 'Myverdant',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: myverdant',
                    url: '',
                },
            ]);
            await client.replyMessage(replyToken, message);
            break;
    }
        case 'ซื้อผลิตภัณฑ์':
            await replyText(client, replyToken, 'Work in progress');
            break;
        default:
            await replyText(client, replyToken, 'ไม่พบตัวเลือกที่ท่านต้องการ');
    }
}

