import { Injectable } from '@nestjs/common';
import { Client, MessageEvent, TextMessage, WebhookEvent, LocationMessage, PostbackEvent } from '@line/bot-sdk';
import { lineConfig_Angles } from 'config/Line_Aurora.config';
import { replyFlex, replyText, } from '../Utils/functions/replyFunction';
import { handleMenuMessage } from '../Aurora/AuroraHandlers/handleMenuMessage';
import { findNearbyServiceCenters, buildNearbyLocationFlex } from '../Utils/functions/locationFunction';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { handleAdminBranchInput } from 'src/hotspot/hotspotHandlers/handleAdminAccess';
import { handleCustomerBranchInput } from 'src/hotspot/hotspotHandlers/handleCustomerAccess';
import { handleAdminOption } from 'src/hotspot/hotspotHandlers/handleAdminAccess';
import { HttpService } from '@nestjs/axios';
import { handlePostbackMessage } from '../Aurora/AuroraHandlers/handlePostbackMessage';
import { handleCustomerAccess } from 'src/hotspot/hotspotHandlers/handleCustomerAccess';
import { NimbusAurora } from 'src/data/AuroraCenter.data';
import { ServiceCenterType } from 'src/Utils/types/serviceCenter.interface';
import { vectorCenters } from 'src/data/vectorCenter.data';
import { zephyrCenters } from 'src/data/zephyrCenter.data';
import { meridianCenters } from 'src/data/meridianCenter.data';
import * as moment from 'moment';
import { askAndAnswerQuestion } from 'src/Utils/functions/askAndAnswerQuestion';
import { SessionService } from 'src/Usersession/session.service';
import { GoogleSheetService } from 'src/GoogleSheet/google-sheet.service';

//To identify user location preference
export let userLocationPreferenceMap: Map<string, string> = new Map();

@Injectable()
export class Auroraervice {
    private userbindbrandMap: Map<string, string> = new Map(); // Map to store userId and their selected brand
    private client: Client;
    constructor(
        private readonly hotspotService: HotspotService, // ✅ Injected via Nest
        private readonly httpService: HttpService,
        private readonly sessionService: SessionService,
        private readonly googleSheetsService: GoogleSheetService
    ) {
        this.client = new Client(lineConfig_Angles);
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

        //continune the Qustion 
        const RESET_SESSION_KEYWORDS = ['ทดลองขับ', 'โปรโมชั่น', 'งานบริการอื่นๆ', 'ศูนย์บริการใกล้ฉัน', 'ข้อมูลผลิตภัณฑ์'];
        if (RESET_SESSION_KEYWORDS.includes(message)) {
            this.sessionService.clear(userId);
        }

        const session = this.sessionService.get(userId);
        if (session && !(RESET_SESSION_KEYWORDS.includes(message))) {
            const selectedbrand = this.userbindbrandMap.get(userId);

            if (!selectedbrand || selectedbrand === '' || selectedbrand === 'undefined') {
                // If brand is not set, we can either prompt the user to select a brand or handle it as needed
                await replyText(this.client, replyToken, 'กรุณากดเริ่มทดลองขับใหม่');
                return;
            }
            const brand = selectedbrand || ""; // Use the brand from the map
            await askAndAnswerQuestion(this.client, replyToken, userId, message, destination, brand, // or dynamic brand
                {
                    sessionService: this.sessionService,
                    googleSheetsService: this.googleSheetsService,
                    hotspotService: this.hotspotService
                });
            if (session.questionIndex > 3) {
            this.userbindbrandMap.delete(userId); // Clear the brand after processing
            console.log(`User ${userId} answered: ${message} and brand is ${brand}. PS: brand is deleted from userbindbrandMap`);
            }
            return;
        }

        // fallback to menu message handler
        const menuReplied = await handleMenuMessage(
            message,
            event.replyToken,
            (token, flex) => replyFlex(this.client, token, flex),
        );
        if (menuReplied) return;

        await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'กรุณาเลือกคำสั่งในริชเมนู',
        });
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
            // This triggers the normal user Wi-Fi access flow for admin
            await handleCustomerAccess(client, replyToken, userId, destination);
            return;
        }
        if (action === 'test-drive-choose-vehicle') {
            const items = item.split("-");
            this.sessionService.create(userId, {
                questionIndex: 1, // Start at second question
                answers: [],
            });
            //console.log(`User ${userId} selected brand: ${items[0]} PS. This is the first time user selected brand`);
            this.userbindbrandMap.set(userId, items[0]); // Store the brand for the user
            //console.log(`User ${userId} selected brand: ${items[0]}`);
            await askAndAnswerQuestion(client, replyToken, userId, items[1], destination, items[0], // or dynamic brand
                {
                    sessionService: this.sessionService,
                    googleSheetsService: this.googleSheetsService,
                    hotspotService: this.hotspotService
                });
            return;
        }
        if (action === 'test-drive-choose-branch') {
            let session = this.sessionService.get(userId);
            const items = item.split("-");
            if (!session) {
                console.log('session not found');
                return;
            }
            await askAndAnswerQuestion(client, replyToken, userId, items[1], destination, items[0], // or dynamic brand
                {
                    sessionService: this.sessionService,
                    googleSheetsService: this.googleSheetsService,
                    hotspotService: this.hotspotService
                });
            return;
        }
        // Handle datetimepicker action
        if (action.startsWith('test-drive-choose-datetime-')) {
            const parts = action.split("-");
            const brand = parts[parts.length - 1];
            let session = this.sessionService.get(userId);

            if (!session) {
                console.log('session not found');
                return;
            }

            // Extract the datetime string
            if (event.postback?.params && 'datetime' in event.postback.params) {
                const datetime = event.postback?.params?.datetime ?? '';
                const formatted = moment(datetime).format('YYYY-MM-DD HH:mm');
                //session.answers['วันเวลาที่นัดหมาย\n(ตั้งแต่เวลา 9:00-17:00 น. หยุดทุกวันอาทิตย์)'] = formatted;
                await askAndAnswerQuestion(client, replyToken, userId, formatted, destination, brand, // or dynamic brand
                    {
                        sessionService: this.sessionService,
                        googleSheetsService: this.googleSheetsService,
                        hotspotService: this.hotspotService
                    });
            }
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

        const location_type = userLocationPreferenceMap.get(userId) || null;

        if (location_type === null) {
            await replyText(this.client, replyToken, 'ไม่พบข้อมูลแบรนด์ที่คุณเลือก กรุณาเลือกแบรนด์ก่อน');
            return;
        }
        let chosenLocationset: ServiceCenterType[] = [];
        switch (location_type) {
            case 'NIMBUS':
                chosenLocationset = NimbusAurora
                break;
            case 'VECTOR':
                chosenLocationset = vectorCenters
                break;
            case 'MERIDIAN':
                chosenLocationset = meridianCenters
                break;
            case 'ZEPHYR':
                chosenLocationset = zephyrCenters
                break;
            default:
                await replyText(this.client, replyToken, 'ไม่พบข้อมูลสถานที่ของแบรนด์ กรุณาเลือกแบรนด์ก่อน');
                return;
        }


        const nearbyCenters = await findNearbyServiceCenters(latitude, longitude, chosenLocationset, 20, 5);

        if (nearbyCenters.length === 0) {
            await replyText(this.client, replyToken, 'ไม่พบศูนย์บริการใกล้เคียง 😥');
            return;
        }

        const flex = buildNearbyLocationFlex(nearbyCenters);
        await replyFlex(this.client, replyToken, flex);
    }

}

