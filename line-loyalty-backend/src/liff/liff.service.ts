import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Client, Message } from '@line/bot-sdk';
import { lineConfig_Angles } from 'config/Line_Aurora.config';
import { lineConfig } from 'config/Line_Verdant.config';

@Injectable()
export class LiffService {
  constructor(private readonly http: HttpService) { }

  async sendWifiToUser(body: any): Promise<any> {
    try {
      const { user, content } = body;
      const botId = user.destination;
      console.log(body);
      // Clean branchCode if needed
      if (body.user.branchId?.startsWith('branch-')) {
        body.user.branchId = body.user.branchId.replace('branch-', '');
      }

      const credentials = await this.requestWifiCredential(body);
      if (!credentials?.username || !credentials?.password) throw new Error("Invalid Wi-Fi credentials");

      const message: Message = {
        type: 'text',
        text: `Hi ${user.username}\n\nyour Wi-Fi username: ${credentials.username}\npassword: ${credentials.password}\nvalid for: ${credentials.Time}`,
      };

      const lineClient = this.getLineClient(botId);
      await lineClient.pushMessage(user.userId, message);

      return body;
    } catch (err) {
      console.error("❌ Failed to send Wi-Fi:", err.message);
      return false;
    }
  }

  private async requestWifiCredential(payload: any) {
    console.log(payload);
    const { data } = await this.http.axiosRef.post(`${process.env.HOTSPOT_API_BASE_URL}/hotspot/Request-wifi`, payload);
    console.log(data);
    return data;
  }

  private getLineClient(botId: string): Client {
    if (botId === process.env.AURORA_UID) {
      return new Client({
        channelAccessToken: lineConfig_Angles.channelAccessToken,
        channelSecret: lineConfig_Angles.channelSecret,
      });
    }

    return new Client({
      channelAccessToken: lineConfig.channelAccessToken,
      channelSecret: lineConfig.channelSecret,
    });
  }
}
