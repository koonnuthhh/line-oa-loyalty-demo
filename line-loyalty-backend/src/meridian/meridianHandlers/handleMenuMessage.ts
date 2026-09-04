import { getButtonOptionsFlexContent } from "../../Utils/functions/flexMessage";
import { FlexMessage } from "@line/bot-sdk";
import { BASE_URL } from "config/baseUrl.config";
import { getLicensePlateList } from "../../Utils/functions/getLicensePlateList";
import { Client } from "@line/bot-sdk";
import { lineConfig_MERIDIAN } from "config/Line_Meridian.config";
import { websiteCarouselFlexContent } from "../../Utils/functions/flexMessage";
import { handleServiceCenter } from "./handleServiceCenter";
import { airtable } from "config/airtable_nimbus.config";
import { fetchAirtableImages } from "src/Utils/functions/getphoto";
import { SessionService } from "src/Usersession/session.service";
import { meridiandriveTest } from "src/data/meridianDrivetest";

const client = new Client(lineConfig_MERIDIAN);

const moreOptions = ['ช่องทางการติดต่อ', 'สมัครงาน', 'ขอรหัส wi-fi', 'บริจาคเงินช่วยเหลือเด็กๆ', 'แบบประเมินความพึงพอใจ', 'อื่นๆ'];

export async function handleMenuMessage(
    message: string,
    replyToken: string,
    replyFlex: (token: string, flex: FlexMessage) => Promise<void>,
    //userId: string,
    //sessionService: SessionService,
): Promise<boolean> {
    switch (message) {

        //ช่อง2
        case 'ข้อมูลผลิตภัณฑ์': {
            const records = await fetchAirtableImages('MERIDIAN_car', airtable);

            const items = records.map((item) => ({
                title: item.name,
                imageUrl: encodeURI(item.imageUrl || `${BASE_URL}/assets/images/demo-image.png`),
                location: ' ' ,
                url: encodeURI(item.description || ''),
            }));

            const message = websiteCarouselFlexContent('ข้อมูลผลิตภัณฑ์', items, "ดูรายละเอียดเพิ่มเติม");
            await client.replyMessage(replyToken, message);
            return true;
        }

        //ช่อง3
        case 'ศูนย์บริการใกล้ฉัน': {
            await handleServiceCenter(client, replyToken, 'ศูนย์บริการใกล้ฉัน');
            return true;
        }
        //ช่อง4
        case 'ทดลองขับ': {
               const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nรถที่ต้องการทดลอง',
                meridiandriveTest.map((label) => ({
                    label,
                    postbackData: `action=Drivetest&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(replyToken, flex);
            
            return true;
        }
        //ช่อง5
        case 'โปรโมชั่น': {
             const records = await fetchAirtableImages('MERIDIAN_promotion', airtable);

            const items = records.map((item) => ({
                title: item.name,
                imageUrl: encodeURI(item.imageUrl || `${BASE_URL}/assets/images/demo-image.png`),
                location: ' ' ,
                url: encodeURI(item.description || ''),
            }));

            const message = websiteCarouselFlexContent('โปรโมชั่น', items,"ดูรายละเอียดเพิ่มเติม");
            await client.replyMessage(replyToken, message);
            return true;
        
        }
        //ช่อง6
        case 'งานบริการอื่นๆ': {
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
