import { getButtonOptionsFlexContent } from "../../Utils/functions/flexMessage";
import { FlexMessage } from "@line/bot-sdk";
import { BASE_URL } from "config/baseUrl.config";
import { getLicensePlateList } from "../../Utils/functions/getLicensePlateList";
import { Client } from "@line/bot-sdk";
import { lineConfig } from "config/Line_Verdant.config";
import { websiteCarouselFlexContent } from "../../Utils/functions/flexMessage";

const client = new Client(lineConfig);
const servicesOptions = ['ศูนย์บริการใกล้ฉัน', 'ตรอ. ใกล้ฉัน', 'โปรโมชั่นศูนย์บริการ'];
const regandinsureOptions = ['ต่อทะเบียน', 'ต่อพรบ.', 'ซื้อ/ต่อประกัน'];
const moreOptions = ['ช่องทางการติดต่อ', 'สมัครงาน', 'ขอรหัส wi-fi', 'บริจาคเงินช่วยเหลือเด็กๆ', 'แบบประเมินความพึงพอใจ', 'อื่นๆ'];
const productOptions = ['ดูข้อมูลผลิตภัณฑ์', 'ซื้อผลิตภัณฑ์'];

export async function handleMenuMessage(
    message: string,
    replyToken: string,
    replyFlex: (token: string, flex: FlexMessage) => Promise<void>,
    replyText: (token: string, text: string) => Promise<void>,
): Promise<boolean> {
    switch (message) {
        case 'เช็คค่างวด': {
            const licensePlate = await getLicensePlateList();
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
                licensePlate.map((plate) => ({
                    label: plate,
                    postbackData: `action=checkInstallment&plate=${encodeURIComponent(plate)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        case 'ข้อมูลผลิตภัณฑ์': {
            const options = [
                {
                    label: 'ดูข้อมูลผลิตภัณฑ์',
                    postbackData: 'action=ProductOption&item=ดูข้อมูลผลิตภัณฑ์'
                },
                {
                    label: 'ซื้อผลิตภัณฑ์',
                    postbackData: 'action=ProductOption&item=ซื้อผลิตภัณฑ์'
                }
            ];
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือกตัวเลือก',
                options
            );
            await replyFlex(replyToken, flex);
            return true;
        }


        case 'ศูนย์บริการ/ตรอ.': {
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                servicesOptions.map((label) => ({
                    label,
                    postbackData: `action=serviceCenter&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        case 'งานทะเบียน/ประกัน/พรบ.': {
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                regandinsureOptions.map((label) => ({
                    label,
                    postbackData: `action=insurance&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        case 'สิทธิพิเศษ/สมาชิก': {
            await client.replyMessage(replyToken, [
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
            return true;
        }

        case 'งานบริการอื่นๆ/ติดต่อสอบถาม': {
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                moreOptions.map((label) => ({
                    label,
                    postbackData: `action=other&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(replyToken, flex);
            return true;
        }

        default:
            return false;
    }
}
