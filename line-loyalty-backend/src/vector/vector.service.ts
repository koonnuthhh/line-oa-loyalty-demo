import { Injectable } from '@nestjs/common';
import { Client, MessageEvent, TextMessage, WebhookEvent, LocationMessage, PostbackEvent } from '@line/bot-sdk';
import { lineConfig_VECTOR } from 'config/Line_Vector.config';
import { replyFlex, replyText, } from '../Utils/functions/replyFunction';
import { handleMenuMessage } from 'src/vector/vectorHandlers/handleMenuMessage';
import { findNearbyServiceCenters, buildNearbyLocationFlex } from '../Utils/functions/locationFunction';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { handleAdminBranchInput } from 'src/hotspot/hotspotHandlers/handleAdminAccess';
import { handleCustomerBranchInput } from 'src/hotspot/hotspotHandlers/handleCustomerAccess';
import { handleAdminOption } from 'src/hotspot/hotspotHandlers/handleAdminAccess';
import { HttpService } from '@nestjs/axios';
import { handlePostbackMessage } from 'src/vector/vectorHandlers/handlerspostback_Auroras';
import { handleCustomerAccess } from 'src/hotspot/hotspotHandlers/handleCustomerAccess';
import { vectorCenters } from 'src/data/vectorCenter.data';
import { SessionService } from 'src/Usersession/session.service';
import { getButtonOptionsFlexContent } from 'src/Utils/functions/flexMessage';
import { QUESTIONS } from 'src/data/Question';
import { vectorbranch } from 'src/data/vectorbranch';
import { GoogleSheetService } from 'src/GoogleSheet/google-sheet.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { getDatetimePickerFlexContent } from 'src/Utils/functions/datetimepicker';
import { askAndAnswerQuestion } from 'src/Utils/functions/askAndAnswerQuestion';
import { handleAdminStatusUpdate } from 'src/Utils/functions/handleAdminStatusUpdate';
import * as moment from 'moment';
import { getAdminSession,getCustomerSession,clearAdminSession,clearCustomerSession } from 'src/Utils/session/userSession.store';
import { HttpModule } from '@nestjs/axios'; // ✅ correct




@Injectable()
export class VectorService {
    private client: Client;

    constructor(
        private readonly hotspotService: HotspotService, // ✅ Injected via Nest
        private readonly httpService: HttpService,
        private readonly sessionService: SessionService,
        private readonly googleSheetsService: GoogleSheetService,
    ) {
        this.client = new Client(lineConfig_VECTOR);
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
        const statusUpdated = await handleAdminStatusUpdate(this.client, replyToken, message, destination, "VECTOR", {
            googleSheetsService: this.googleSheetsService,  // Injected GoogleSheetService
        });
        if (statusUpdated) return;


         const containsThai = /[\u0E00-\u0E7F]/.test(message);

        if (!containsThai) {
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

        if (handledUser) return;}   
                 if (getAdminSession(userId) || getCustomerSession(userId)) {
                            clearAdminSession(userId);
                            clearCustomerSession(userId);
                        }

        //continune the Qustion 
        const RESET_SESSION_KEYWORDS = ['ทดลองขับ', 'โปรโมชั่น', 'งานบริการอื่นๆ', 'ศูนย์บริการใกล้ฉัน', 'ข้อมูลผลิตภัณฑ์'];
        if (RESET_SESSION_KEYWORDS.includes(message)) {
            this.sessionService.clear(userId);
        }

        const session = this.sessionService.get(userId);
        if (session && !(RESET_SESSION_KEYWORDS.includes(message))) {
            await askAndAnswerQuestion(this.client, replyToken, userId, message, destination, 'VECTOR', // or dynamic brand
                {
                    sessionService: this.sessionService,
                    googleSheetsService: this.googleSheetsService,
                    hotspotService: this.hotspotService
                });
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
            // This triggers the normal customer Wi-Fi access flow for admin
            await handleCustomerAccess(client, replyToken, userId, destination);
            return;
        }

        if (action === 'Drivetest') {

            this.sessionService.create(userId, {
                questionIndex: 1, // Start at second question
                answers: [],
            });

            await askAndAnswerQuestion(client, replyToken, userId, item, destination, 'VECTOR', // or dynamic brand
                {
                    sessionService: this.sessionService,
                    googleSheetsService: this.googleSheetsService,
                    hotspotService: this.hotspotService
                });
            return;
        }
        if (action === 'DrivetestBranch') {
            let session = this.sessionService.get(userId);

            if (!session) {
                console.log('session not found');
                return;
            }
            await askAndAnswerQuestion(client, replyToken, userId, item, destination, 'VECTOR', // or dynamic brand
                {
                    sessionService: this.sessionService,
                    googleSheetsService: this.googleSheetsService,
                    hotspotService: this.hotspotService
                });
            return;
        }
        // Handle datetimepicker action
        if (action === 'DrivetestDateTime') {
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
                await askAndAnswerQuestion(client, replyToken, userId, formatted, destination, 'VECTOR', // or dynamic brand
                    {
                        sessionService: this.sessionService,
                        googleSheetsService: this.googleSheetsService,
                        hotspotService: this.hotspotService
                    });
            }
            // ✅ SET the correct field


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

        const nearbyCenters = await findNearbyServiceCenters(latitude, longitude, vectorCenters, 200, 5);

        if (nearbyCenters.length === 0) {
            await replyText(this.client, replyToken, 'ไม่พบศูนย์บริการใกล้เคียง 😥');
            return;
        }

        const flex = buildNearbyLocationFlex(nearbyCenters);
        await replyFlex(this.client, replyToken, flex);
    }



}
