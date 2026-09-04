import { Client } from '@line/bot-sdk';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { convertDateTime } from '../functions/convertDateTime';
import { hotspotAPIConfig } from 'config/hotspotAPI.config';
import { getUserDisplayName } from 'src/Utils/functions/getUserDisplayName';


const now = new Date();
const formattedDate = convertDateTime(now);
const hotspotURL = hotspotAPIConfig.hotspotURL;

const ADMIN_HOTSPOT_API_BASE = '/hotspot/Admin';

// ==== ADMIN API ====

// GET LOG
export async function getUsageLog(
    client: Client, replyToken: string, httpService: HttpService, hotspotURL: string, userId: string, destination: string, branchId: string): Promise<void> {
    try {
        const response = await firstValueFrom(
            httpService.post(`${hotspotURL}${ADMIN_HOTSPOT_API_BASE}/getLogs`, {
                user: {
                    userId,
                    destination,
                    branchId
                },
                content: {
                    request: 'usageLog'
                },
            })
        );

        const logs: string[] = response.data?.logs || [];
        const messageText = logs.length
            ? `📊 ประวัติการใช้งาน:\n\n` + logs.map((log, i) => `${i + 1}. ${log}`).join('\n\n')
            : 'ไม่พบประวัติการใช้งาน';

        await client.replyMessage(replyToken, {
            type: 'text',
            text: messageText,
        });
    } catch (error: any) {
        console.error('❌ getUsageLogAdmin error:', error.message || error);
        await client.replyMessage(replyToken, {
            type: 'text',
            text: 'ไม่สามารถดึงข้อมูลประวัติการใช้งานได้ในขณะนี้',
        });
    }
}

// RESET WIFI
export async function resetWifi(
    client: Client, replyToken: string, httpService: HttpService, hotspotURL: string, userId: string, destination: string, branchId: string): Promise<void> {
    try {
        const response = await firstValueFrom(
            httpService.post(`${hotspotURL}${ADMIN_HOTSPOT_API_BASE}/resetWifi`, {
                user: {
                    userId,
                    destination,
                    branchId
                },
                content: {
                    request: 'resetWifi'
                },
            })
        );

        const messageText = response.data?.Text || 'ไม่สามารถรับข้อความจากเซิร์ฟเวอร์ได้';
        await client.replyMessage(replyToken, {
            type: 'text',
            text: messageText,
        });
    } catch (error: any) {
        console.error('❌ resetWifiAdmin error:', error.message || error);
        await client.replyMessage(replyToken, {
            type: 'text',
            text: 'ไม่สามารถรีเซ็ตรหัสผ่านได้ในขณะนี้',
        });
    }
}


// ==== USER API ====

// GET WIFI USER AND PASSWORD
export async function getWiFi(
    client: Client,
    httpService: HttpService,
    userId: string,
    destination: string,
    branchId: string
): Promise<{ username?: string; password?: string ; Time?: string}> {
    const username = await getUserDisplayName(client, userId);
    
    const response = await firstValueFrom(
        httpService.post(`${hotspotURL}/hotspot/Request-wifi`, {
            user: {
                userId,
                username,
                destination,
                branchId,
            },
            content: {
                formattedDate,
            },
        }),
    );

    if (response.data?.username && response.data?.password) {
  return response.data;
} else {
  throw new Error(response.data?.Text || 'Unknown error from WiFi API');
}
}


// SPAM GET WIFI USER AND PASSWORD
export async function spamGetWiFi(
    client: Client,
    httpService: HttpService,
    userId: string,
    destination: string,
    branchId: string
): Promise<boolean> {
    const username = await getUserDisplayName(client, userId);
    
    console.log('username', username);
    const response = await firstValueFrom(
        httpService.post(`${hotspotURL}/hotspot/Spam`, {
            user: {
                userId,
                username,
                destination,
                branchId,
            },
            content: {
                formattedDate,
            },
        }),
    );

    console.log('SPAMMED for', username);
    return response.data?.Text === 'Not Exceed Hour';
}

