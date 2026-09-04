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
                    title: 'Verdant Motors',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: รถยนต์ใหม่',
                    url: 'https://example.com',
                },
                {
                    title: 'Verdant Financial',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: สินเชื่อ',
                    url: 'https://example.com',
                },
                {
                    title: 'Verdant Insurance',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: ประกันภัย',
                    url: 'https://example.com',
                },
                {
                    title: 'Verdant Moto',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: รถจักรยานยนต์',
                    url: 'https://example.com',
                },
                {
                    title: 'Verdant Service',
                    imageUrl: `${BASE_URL}/assets/images/demo-image.png`,
                    location: 'หมวดหมู่: บริการหลังการขาย',
                    url: 'https://example.com',
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

