import { Injectable } from '@nestjs/common';
import { Client, MessageEvent, TextMessage, WebhookEvent, LocationMessage, PostbackEvent } from '@line/bot-sdk';
import { lineConfig } from 'config/Line_Verdant.config';
import { replyFlex, replyText, } from '../Utils/functions/replyFunction';
import { handleMenuMessage } from './verdantHandlers/handleMenuMessage';
import { findNearbyServiceCenters, buildNearbyLocationFlex } from '../Utils/functions/locationFunction';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { handleAdminBranchInput } from 'src/hotspot/hotspotHandlers/handleAdminAccess';
import { handleCustomerBranchInput } from 'src/hotspot/hotspotHandlers/handleCustomerAccess';
import { handleAdminOption } from 'src/hotspot/hotspotHandlers/handleAdminAccess';
import { HttpService } from '@nestjs/axios';
import { handlePostbackMessage } from './verdantHandlers/handlePostbackMessage';
import { handleCustomerAccess } from 'src/hotspot/hotspotHandlers/handleCustomerAccess';
import { verdantCenters } from 'src/data/verdantCenter.data';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class VerdantService {
    private client: Client;

    constructor(
        private readonly hotspotService: HotspotService, // ✅ Injected via Nest
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.client = new Client(lineConfig);
    }
    async webhookHandler(reqBody: any) {
        const { destination, events } = reqBody;

        for (const event of events) {
            await this.handleEvent(event, destination);
        }
    }

    // Update handleEvent signature to accept destination:
    async handleEvent(event: WebhookEvent, destination: string): Promise<void> {
        try {
            if (event.type === 'message') {
                if (event.message.type === 'text') {
                    await this.handleMessageEvent(event, destination);
                } else if (event.message.type === 'location') {
                    await this.handleLocationEvent(event);
                }
            } else if (event.type === 'postback') {
                await this.handlePostbackEvent(this.client, event, destination);
            }

            else {
                console.log('Unhandled event type:', event.type);
            }
        } catch (error) {
            console.error('Error handling event:', error);
        }
    }

    async handleMessageEvent(event: MessageEvent, destination: string): Promise<void> {
        const userId = event.source.userId;
        if (!userId) {
            console.error('User ID is missing!');
            return;
        }

        const replyToken = event.replyToken;
        const message = (event.message as TextMessage).text.trim();

        // Welcome / help: show the available text commands (demo runs without a rich menu)
        const HELP_KEYWORDS = ['help', 'menu', 'start', 'hi', 'hello', 'สวัสดี', 'เริ่ม', 'เริ่มต้น',
            'เริ่มใช้', 'เมนู', 'คำสั่ง', 'ช่วยเหลือ'];
        if (HELP_KEYWORDS.includes(message.toLowerCase())) {
            await this.sendHelpMenu(replyToken);
            return;
        }

        // Try admin branch input handler first
        const handledAdmin = await handleAdminBranchInput(this.httpService, this.client, replyToken, userId, destination, message);
        if (handledAdmin) return;

        const handledUser = await handleCustomerBranchInput(
            this.hotspotService['httpService'],
            this.client,
            event.replyToken,
            userId,
            destination,
            message,);

        if (handledUser) return;

        // fallback to menu message handler
        const menuReplied = await handleMenuMessage(
            message,
            event.replyToken,
            (token, flex) => replyFlex(this.client, token, flex),
            (token, text) => replyText(this.client, token, text),
        );
        if (menuReplied) return;

        // No keyword matched -> show the command list so the demo is self-explanatory
        await this.sendHelpMenu(event.replyToken);
    }

    /** Welcome / help message listing the text commands the bot understands. */
    private async sendHelpMenu(replyToken: string): Promise<void> {
        const text = [
            'ยินดีต้อนรับสู่ Verdant Demo Bot 🤖',
            '',
            'พิมพ์คำสั่งด้านล่างเพื่อเริ่มใช้งาน หรือแตะปุ่มได้เลย:',
            '• ข้อมูลผลิตภัณฑ์ — ดูรายการผลิตภัณฑ์',
            '• เช็คค่างวด — เช็คค่างวดรถยนต์',
            '• ศูนย์บริการ/ตรอ. — ค้นหาศูนย์บริการ (แชร์ตำแหน่ง)',
            '• งานทะเบียน/ประกัน/พรบ. — งานเอกสารและประกัน',
            '• สิทธิพิเศษ/สมาชิก — โปรโมชันและสิทธิ์สมาชิก',
            '• งานบริการอื่นๆ/ติดต่อสอบถาม — ติดต่อทีมงาน',
            '',
            'พิมพ์ help / เมนู ได้ทุกเมื่อเพื่อดูคำสั่งอีกครั้ง',
        ].join('\n');

        const quickReplyItems = [
            { type: 'action', action: { type: 'message', label: 'ข้อมูลผลิตภัณฑ์', text: 'ข้อมูลผลิตภัณฑ์' } },
            { type: 'action', action: { type: 'message', label: 'เช็คค่างวด', text: 'เช็คค่างวด' } },
            { type: 'action', action: { type: 'message', label: 'ศูนย์บริการ/ตรอ.', text: 'ศูนย์บริการ/ตรอ.' } },
            { type: 'action', action: { type: 'message', label: 'สิทธิพิเศษ/สมาชิก', text: 'สิทธิพิเศษ/สมาชิก' } },
        ];

        const payload: any = {
            type: 'text',
            text,
            quickReply: { items: quickReplyItems },
        };

        await this.client.replyMessage(replyToken, payload);
    }


    //handle postback

    async handlePostbackEvent(client: Client, event: PostbackEvent, destination: string): Promise<void> {
        const data = event.postback.data;
        const replyToken = event.replyToken;
        const userId = event.source.userId;

        if (!data || !userId) {
            await replyText(client, replyToken, 'ไม่สามารถประมวลผลข้อมูลได้');
            return;
        }

        // for hotspot pay load
        const params = Object.fromEntries(new URLSearchParams(data));
        const action = params['action'];
        const item = decodeURIComponent(params['item'] || '');

        if (action === 'resetWifi' || action === 'usageLog') {
            await handleAdminOption(client, replyToken, userId, destination, action as 'resetWifi' | 'usageLog');
            return;
        }

        if (action === 'getWifi') {
            // This triggers the normal customer Wi-Fi access flow for admin
            await handleCustomerAccess(client, replyToken, userId, destination);
            return;
        }

        await handlePostbackMessage(client, replyToken, action, item, params, this.hotspotService, userId, destination);
    }


    //handle location event
    async handleLocationEvent(event: MessageEvent): Promise<void> {
        console.log('📍 handleLocationEvent triggered');

        const userId = event.source.userId;
        const replyToken = event.replyToken;

        if (!userId) {
            console.error('Missing userId');
            return;
        }

        const message = event.message as LocationMessage;
        const { latitude, longitude, address } = message;

        console.log(`User sent location: ${latitude}, ${longitude}, ${address}`);

        const detectionRadius = this.configService.get<string>('ServiceCenterDetectionRadius');
        if (!detectionRadius) {
            throw new Error('ServiceCenterDetectionRadius is not set in .env');
        }
        const nearbyCenters = await findNearbyServiceCenters(latitude, longitude, verdantCenters, detectionRadius, 5);

        if (nearbyCenters.length === 0) {
            await replyText(this.client, replyToken, 'ไม่พบศูนย์บริการใกล้เคียง 😥');
            return;
        }

        const flex = buildNearbyLocationFlex(nearbyCenters);
        await replyFlex(this.client, replyToken, flex);
    }

}
