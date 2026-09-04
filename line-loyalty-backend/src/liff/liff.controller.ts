import { Controller, Post, Get, Render, Body, Query, Param } from '@nestjs/common';
import { LiffService } from './liff.service';

@Controller()
export class LiffController {
  constructor(private readonly liffService: LiffService) {}

  @Get('liff')
  @Render('liff')
  getLiffPage(@Query('liff.state') state: string) {
    // Extract botId to select correct LIFF ID
    const botId = state?.split('_')?.[1]?.replace('botId-', '') || '';
    let liffId = process.env.VERDANT_LINE_LIFF_ID;

    if (botId === process.env.AURORA_UID) {
      liffId = process.env.AURORA_LINE_LIFF_ID;
    }

    return {
      liffId,
      backendApiUrl: process.env.BASE_URL + '/wifi-request',
      state: state || '',
    };
  }

  
  @Get('liff/:state')
  @Render('liff')
  getLiffPages(@Param('liff.state') state: string) {
    // Extract botId to select correct LIFF ID
    const botId = state?.split('_')?.[1]?.replace('botId-', '') || '';
    let liffId = process.env.VERDANT_LINE_LIFF_ID;

    if (botId === process.env.AURORA_UID) {
      liffId = process.env.AURORA_LINE_LIFF_ID;
    }

    return {
      liffId,
      backendApiUrl: process.env.BASE_URL + '/wifi-request',
      state: state || '',
    };
  }


  @Post('wifi-request')
  async handleWifiRequest(@Body() body: any) {
    return await this.liffService.sendWifiToUser(body);
  }
}
