import { Body, Controller, Post, Get, HttpCode } from '@nestjs/common';
import { HotspotService } from './hotspot.service';
import { ApiTags, ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { CheckAdminDTO, GetWifiDTO, GetLogsDTO, ResetWifiDTO } from './dto/formatted.dto';
import { WifiCredentialResponse, IsAdminResponse, TextOnlyResponse, LogsResponse } from './dto/respond.dto';
import { STATUS_CODES } from 'http';

@ApiTags('hotspot')
@Controller('hotspot')
export class HotspotController {
  constructor(private readonly hotspotService: HotspotService) { }

  @HttpCode(200)
  @ApiOperation({ summary: "Check user Is that user Is admin?" })
  @Post('check-admin')
  @ApiBody({ type: CheckAdminDTO })
  @ApiResponse({ status: 200, type: IsAdminResponse })
  @ApiResponse({ status: 404, type: TextOnlyResponse })
  async checkAdmin(@Body() body: CheckAdminDTO) {

    const isAdmin = await this.hotspotService.checkAdmin(body.user.userId, body.user.destination);
    return { isAdmin };
  }

  @HttpCode(200)
  @ApiOperation({ summary: "For user who request wifi credential" })
  @Post('Request-wifi')
  @ApiBody({ type: GetWifiDTO })
  @ApiResponse({ status: 200, type: WifiCredentialResponse })
  @ApiResponse({ status: 404, type: TextOnlyResponse })
  async GetWifiCredential(@Body() body: GetWifiDTO) {
    return await this.hotspotService.assignNextWifiCredential(body);

  }

  @HttpCode(200)
  @ApiOperation({ summary: "For the admin activity Get data log" })
  @Post('Admin/getLogs')
  @ApiBody({ type: GetLogsDTO })
  @ApiResponse({ status: 200, type: LogsResponse })
  @ApiResponse({ status: 404, type: TextOnlyResponse })
  async GetLogs(@Body() body: GetLogsDTO) {
    if (body.content.request == "usageLog")
      return await this.hotspotService.getLogs(body);

  }


  @HttpCode(200)
  @ApiOperation({ summary: "For the admin reset wifi quota" })
  @Post('Admin/resetWifi')
  @ApiBody({ type: ResetWifiDTO })
  @ApiResponse({ status: 200, type: TextOnlyResponse })
  @ApiResponse({ status: 404, type: TextOnlyResponse })
  async ResetWifi(@Body() body: ResetWifiDTO) {
    if (body.content.request == "resetWifi")
      return await this.hotspotService.resetWifi(body);

  }

  @HttpCode(200)
  @ApiOperation({ summary: "For spam request" })
  @Post('Spam')
  @ApiBody({ type: GetWifiDTO })
  @ApiResponse({ status: 201, type: LogsResponse })
  @ApiResponse({ status: 404, type: TextOnlyResponse })
  async saveLogsforSpam(@Body() body: GetWifiDTO) {
    return await this.hotspotService.saveSpameLogs(body);
  }


  @HttpCode(200)
  @ApiOperation({ summary: "Get all admin_uid from lineoa_uid" })
  @Post('admin-uids')
  async getAdminUids(@Body('destination') destination: string): Promise<{ adminUids: string[] }> {
    const adminUids = await this.hotspotService.findAllUidsFromLineOaUid(destination);
    return { adminUids };
  }

}




