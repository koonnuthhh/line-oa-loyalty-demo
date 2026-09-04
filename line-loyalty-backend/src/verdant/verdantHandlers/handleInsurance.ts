import { Client } from '@line/bot-sdk';
import { replyFlex } from '../../Utils/functions/replyFunction';
import { getButtonOptionsFlexContent } from '../../Utils/functions/flexMessage';
import { getLicensePlateList } from '../../Utils/functions/getLicensePlateList';

export async function handleInsurance(
    client: Client,
    replyToken: string,
    item: string
): Promise<void> {
    switch (item) {

        //renewLicense
        case 'ต่อทะเบียน': {
            const plates = await getLicensePlateList();
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
                plates.map((plate) => ({
                    label: plate,
                    postbackData: `action=renewLicense&plate=${encodeURIComponent(plate)}`,
                }))
            );

            await replyFlex(client, replyToken, flex);
            return;
        }

        //renewRegistration
        case 'ต่อพรบ.': {
            const plates = await getLicensePlateList();
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nเลขทะเบียนรถที่ท่านต้องการตรวจสอบ',
                plates.map((plate) => ({
                    label: plate,
                    postbackData: `action=renewInsurance&plate=${encodeURIComponent(plate)}`,
                }))
            );

            await replyFlex(client, replyToken, flex);
            return;
        }

        //renewOrBuyInsurance
        case 'ซื้อ/ต่อประกัน': {
            const options = ['ซื้อประกัน', 'ต่อประกัน']
            const flex = getButtonOptionsFlexContent(
                'กรุณาเลือก\nงานบริการที่ท่านต้องการ',
                options.map((label) => ({
                    label,
                    postbackData: `action=renewOrBuyInsurance&item=${encodeURIComponent(label)}`
                }))
            );
            await replyFlex(client, replyToken, flex);
            return;
        }

        default: {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: 'ไม่สามารถระบุคำสั่งได้ 😢',
            });
            return;
        }
    }
}
