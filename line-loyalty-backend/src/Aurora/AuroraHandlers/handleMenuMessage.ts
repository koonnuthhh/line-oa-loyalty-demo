import { getButtonOptionsFlexContent, PostbackCarouselFlexContent } from "../../Utils/functions/flexMessage";
import { FlexMessage } from "@line/bot-sdk";
import { BASE_URL } from "config/baseUrl.config";
import { Client } from "@line/bot-sdk";
import { lineConfig_Angles } from "config/Line_Aurora.config";

const client = new Client(lineConfig_Angles);
const servicesOptions = ['ศูนย์บริการใกล้ฉัน', 'ตรอ. ใกล้ฉัน', 'โปรโมชั่นศูนย์บริการ'];
const moreOptions = ['ช่องทางการติดต่อ', 'สมัครงาน', 'ขอรหัส wi-fi', 'Verdant Money', 'บริจาคเงินช่วยเหลือเด็กๆ', 'แบบประเมินความพึงพอใจ', 'อื่นๆ'];

export async function handleMenuMessage(
    message: string,
    replyToken: string,
    replyFlex: (token: string, flex: FlexMessage) => Promise<void>,
): Promise<boolean> {
    switch (message) {

        case 'ข้อมูลผลิตภัณฑ์': {
            const message = PostbackCarouselFlexContent('ข้อมูลผลิตภัณฑ์', [
                {
                    title: 'Nimbus',
                    imageUrl: ``,
                    location: 'หมวดหมู่: Nimbus',
                    postbackData: 'action=ChooseProduct&item=Nimbus',
                },
                {
                    title: 'MERIDIAN',
                    imageUrl: ``,
                    location: 'หมวดหมู่: MERIDIAN',
                    postbackData: 'action=ChooseProduct&item=MERIDIAN',
                },
                {
                    title: 'VECTOR',
                    imageUrl: ``,
                    location: 'หมวดหมู่: VECTOR',
                    postbackData: 'action=ChooseProduct&item=VECTOR',
                },
                {
                    title: 'Zephyr',
                    imageUrl: ``,
                    //imageUrl: ``,
                    location: 'หมวดหมู่: Zephyr',
                    postbackData: 'action=ChooseProduct&item=Zephyr',
                },
                {
                    title: 'Verdant Money',
                    imageUrl: ``,
                    location: 'หมวดหมู่: Verdant Money',
                    postbackData: 'action=VerdantMoney',
                }
            ]);
            await client.replyMessage(replyToken, message);
            return true;
        }


      case 'ศูนย์บริการ': {
    const flex = PostbackCarouselFlexContent('กรุณาเลือกแบรนด์ที่ท่านต้องการ', [
         {
            title: 'Nimbus',
            imageUrl: ``,
            location: ' ',
            postbackData: 'action=serviceCenter&item=NIMBUS',
        },
        {
            title: 'MERIDIAN',
            imageUrl: ``,
            location: ' ',
            postbackData: 'action=serviceCenter&item=MERIDIAN',
        },
        {
            title: 'VECTOR',
            imageUrl: ``,
            location: ' ',
            postbackData: 'action=serviceCenter&item=VECTOR',
        },
        {
            title: 'Zephyr',
            imageUrl: ``,
            location: ' ',
            postbackData: 'action=serviceCenter&item=ZEPHYR',
        },
    ], "เลือกแบรนด์บริการนี้");




    await client.replyMessage(replyToken, flex);
    await replyFlex(replyToken, flex);
    return true;
}
        case 'ทดลองขับ': {
            const flex = PostbackCarouselFlexContent("ขอทดลองขับ", [
                {
                    title: 'Nimbus',
                    imageUrl: ``,
                    location: 'หมวดหมู่: Nimbus',
                    postbackData: 'action=test-drive&item=Nimbus',
                },
                {
                    title: 'MERIDIAN',
                    imageUrl: ``,
                    location: 'หมวดหมู่: MERIDIAN',
                    postbackData: 'action=test-drive&item=MERIDIAN',
                },
                {
                    title: 'VECTOR',
                    imageUrl: ``,
                    location: 'หมวดหมู่: VECTOR',
                    postbackData: 'action=test-drive&item=VECTOR',
                },
                {
                    title: 'Zephyr',
                    imageUrl: ``,
                    // imageUrl: `${BASE_URL}/assets/imagesaurora/brandlogo/Zephyr.png`,
                    //imageUrl: ``,
                    location: 'หมวดหมู่: Zephyr',
                    postbackData: 'action=test-drive&item=Zephyr',
                },
            ], "ทดลองขับแบรนนี้");
            await replyFlex(replyToken, flex);
            return true;
        }


        case 'สิทธิพิเศษ/สมาชิก': {
            // const flex = PostbackCarouselFlexContent("สิทธิพิเศษ/สมาชิก", [
            //     {
            //         title: 'Nimbus',
            //         imageUrl: ``,
            //         location: 'โปรโมชั่น: Nimbus',
            //         postbackData: 'action=Promotion&item=Nimbus',
            //     },
            //     {
            //         title: 'MERIDIAN',
            //         imageUrl: ``,
            //         location: 'โปรโมชั่น: MERIDIAN',
            //         postbackData: 'action=Promotion&item=MERIDIAN',
            //     },
            //     {
            //         title: 'VECTOR',
            //         imageUrl: ``,
            //         location: 'โปรโมชั่น: VECTOR',
            //         postbackData: 'action=Promotion&item=VECTOR',
            //     },
            //     {
            //         title: 'Zephyr',
            //         imageUrl: ``,
            //         location: 'โปรโมชั่น: Zephyr',
            //         postbackData: 'action=Promotion&item=Zephyr',
            //     },
            // ], "ดูโปรโมชั่นแบรนด์นี้");
            // await replyFlex(replyToken, flex);
            // return true;
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
