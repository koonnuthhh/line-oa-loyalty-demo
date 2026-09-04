import { Client, FlexMessage } from '@line/bot-sdk';
import { BASE_URL } from 'config/baseUrl.config';
import { zephyrdriveTest } from 'src/data/zephyrDrivetest';
import { meridiandriveTest } from 'src/data/meridianDrivetest';
import { vectordriveTest } from 'src/data/vectorDrivetest';
import { nimbusdriveTest } from 'src/data/nimbusDrivetest';
import { getButtonOptionsFlexContent } from 'src/Utils/functions/flexMessage';
import { replyFlex, replyText } from 'src/Utils/functions/replyFunction';

export async function handleTestDrive(
    client: Client,
    replyToken: string,
    item: string,
    replyFlex: (token: string, flex: FlexMessage) => Promise<void>
): Promise<void> {

    switch (item) {
        case 'Nimbus':
            await replyFlex(replyToken,getButtonOptionsFlexContent(
                'กรุณาเลือก\nรถที่ต้องการทดลอง',
                nimbusdriveTest.map((label) => ({
                    label,
                    postbackData: `action=test-drive-choose-vehicle&item=Nimbus-${encodeURIComponent(label)}`
                }))
            ));
            break;
        case 'MERIDIAN':
            await replyFlex(replyToken,getButtonOptionsFlexContent(
                'กรุณาเลือก\nรถที่ต้องการทดลอง',
                meridiandriveTest.map((label) => ({
                    label,
                    postbackData: `action=test-drive-choose-vehicle&item=MERIDIAN-${encodeURIComponent(label)}`
                }))
            ));
            break;
        case 'VECTOR':
            await replyFlex(replyToken,getButtonOptionsFlexContent(
                'กรุณาเลือก\nรถที่ต้องการทดลอง',
                vectordriveTest.map((label) => ({
                    label,
                    postbackData: `action=test-drive-choose-vehicle&item=VECTOR-${encodeURIComponent(label)}`
                }))
            ));
        case 'Zephyr':
            await replyFlex(replyToken,getButtonOptionsFlexContent(
                'กรุณาเลือก\nรถที่ต้องการทดลอง',
                zephyrdriveTest.map((label) => ({
                    label,
                    postbackData: `action=test-drive-choose-vehicle&item=Zephyr-${encodeURIComponent(label)}`
                }))
            ));
        default:
            replyText(client, replyToken, 'ไม่สามารถระบุคำสั่งได้ 😢');

    }
}