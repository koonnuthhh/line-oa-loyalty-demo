import { getButtonOptionsFlexContent, websiteCarouselFlexContent } from "../../Utils/functions/flexMessage";
import { BASE_URL } from 'config/baseUrl.config';
import { Client } from '@line/bot-sdk';
import { replyFlex, replyText } from '../../Utils/functions/replyFunction';
import { fetchAirtableImages } from "src/Utils/functions/getphoto";
import { airtable } from "config/airtable_nimbus.config";

const buyorbrowseChoice = [{ label: 'ซื้อรถยนต์', choice: "buy" }, { label: 'เลือกดูรถยนต์', choice: "browse" }];

function CreateproductChoice(product: string) {
    const flex = getButtonOptionsFlexContent(
        'กรุณาเลือกบริการที่ท่านต้องการ',
        buyorbrowseChoice.map((label) => ({
            label: label.label,
            postbackData: `action=ChooseProduct&item=${product}-${encodeURIComponent(label.choice)}`
        }))
    );
    return flex;
}




export async function handleChooseProduct(
    Client: Client,
    replyToken: string,
    brand_products: string,
): Promise<void> {


    // Determine which product list to use based on the brand_products parameter
    let product: { name: string; imageUrl: string; location: string; description: string; }[]
    product = [];

    switch (brand_products) {
        //Choose brand
        case 'Nimbus':
            await replyFlex(Client, replyToken, CreateproductChoice('Nimbus'));
            return;
        case 'MERIDIAN':
            await replyFlex(Client, replyToken, CreateproductChoice('MERIDIAN'));
            return;
        case 'VECTOR':
            await replyFlex(Client, replyToken, CreateproductChoice('VECTOR'));
            break;
        case 'Zephyr':
            await replyFlex(Client, replyToken, CreateproductChoice('Zephyr'));
            break;











        //Choose to browse the brand
        case 'Nimbus-browse':
            product = await fetchAirtableImages('Nimbus_car', airtable);
            break;
        case 'MERIDIAN-browse':
            product = await fetchAirtableImages('MERIDIAN_car', airtable);
            break;
        case 'VECTOR-browse':
            product = await fetchAirtableImages('VECTOR_car', airtable);
            break;
        case 'Zephyr-browse':
            product = await fetchAirtableImages('Zephyr_car', airtable);
            break;

        default:
            // If the brand_products is not recognized, send an error message
            await replyText(Client, replyToken, 'ระบบบันทึกคำขอของท่านเรียบร้อยแล้ว กรุณารอสพนักงานตอบกลับ');
            break;
    }
    const items = product.map((item) => ({
        title: item.name,
        imageUrl: encodeURI(item.imageUrl || `${BASE_URL}/assets/images/demo-image.svg`),
        location: ' ',
        url: encodeURI(item.description || ''),
    }));
    const message = websiteCarouselFlexContent('ข้อมูลผลิตภัณฑ์', items, "ดูรายละเอียดเพิ่มเติม");
    await Client.replyMessage(replyToken, message);





    // const message = websiteCarouselFlexContent('ข้อมูลผลิตภัณฑ์', product.map(product => ({
    //     title: product.title,
    //     imageUrl: product.imageUrl,
    //     location: product.location,
    //     url: product.url,
    // })));

    // await Client.replyMessage(replyToken, message);
}