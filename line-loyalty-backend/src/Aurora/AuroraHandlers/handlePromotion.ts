import { websiteCarouselFlexContent } from "../../Utils/functions/flexMessage";
import { BASE_URL } from 'config/baseUrl.config';
import { Client } from '@line/bot-sdk';
import { replyFlex, replyText } from '../../Utils/functions/replyFunction';
import { fetchAirtableImages } from "src/Utils/functions/getphoto";
import { airtable } from "config/airtable_nimbus.config";


export async function handleChoosePromotion(
    Client: Client,
    replyToken: string,
    brand_products: string,
): Promise<void> {
    //const Nimbus_products_list = await fetchAirtableImages('Nimbus_car', airtable);


    // Determine which product list to use based on the brand_products parameter
    let product: { name: string; imageUrl: string; location: string; description: string; }[]

    switch (brand_products) {
        case 'Nimbus':
            product = await fetchAirtableImages('Nimbus_promotion', airtable);
            break;
        case 'MERIDIAN':
            product = await fetchAirtableImages('MERIDIAN_promotion', airtable);
            break;
        case 'VECTOR':
            product = await fetchAirtableImages('VECTOR_promotion', airtable);
            break;
        case 'Zephyr':
            product = await fetchAirtableImages('Zephyr_promotion', airtable);
            break;
        default:
            product = await fetchAirtableImages('Nimbus_promotion', airtable); // Default to Nimbus if no match
    }
    const items = product.map((item) => ({
        title: item.name,
        imageUrl: encodeURI(item.imageUrl || `${BASE_URL}/assets/images/demo-image.svg`),
        location: ' ',
        url: encodeURI(item.description || ''),
    }));

    const message = websiteCarouselFlexContent('โปรโมชั่น', items,"ดูรายละเอียดเพิ่มเติม");
    await Client.replyMessage(replyToken, message);
}