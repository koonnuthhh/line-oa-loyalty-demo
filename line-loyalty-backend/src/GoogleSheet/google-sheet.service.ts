import { Injectable, OnModuleInit } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import * as path from 'path';
import * as moment from 'moment';

@Injectable()
export class GoogleSheetService implements OnModuleInit {
  private sheets: sheets_v4.Sheets;
  private sheetName = 'Sheet1';

  private spreadsheetMap: Record<string, string> = {
    MERIDIAN: '<YOUR_SPREADSHEET_ID>',
    Zephyr: '<YOUR_SPREADSHEET_ID>',
    VECTOR: '<YOUR_SPREADSHEET_ID>',
    Nimbus: '<YOUR_SPREADSHEET_ID>',
  };

  async onModuleInit() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, './google-sheets-key.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  private async getHeaderRow(spreadsheetId: string): Promise<string[]> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${this.sheetName}!1:1`,
    });
    return res.data.values?.[0] || [];
  }

  private async getLastBookingNumber(spreadsheetId: string): Promise<number> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${this.sheetName}!A2:A`,
    });

    const rows = res.data.values || [];
    const last = rows[rows.length - 1]?.[0];
    const number = parseInt(last, 10);
    return isNaN(number) ? 1 : number + 1;
  }
  private getSpreadsheetId(brand: string): string {
    const sheetId = this.spreadsheetMap[brand];
    if (!sheetId) {
      throw new Error(`Unknown brand: ${brand}`);
    }
    return sheetId;
  }

  async appendRow(
    brand: string,
    data: Record<string, string>
  ): Promise<{ savedRow: string[] }> {
    const spreadsheetId = this.getSpreadsheetId(brand);
    const headers = await this.getHeaderRow(spreadsheetId);
    const bookingNumber = await this.getLastBookingNumber(spreadsheetId);
    console.log(data)
    const row = headers.map((header) => {
      if (header === 'หมายเลขการจอง') return bookingNumber.toString().padStart(3, '0');;
      return data[header] || '';
    });

    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: this.sheetName,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return { savedRow: row };
  }
  async updateStatusByBookingIdFast(
    brand: string,
    bookingId: number,
    newStatus: string
  ): Promise<Record<string, string>> {
    const spreadsheetId = this.getSpreadsheetId(brand);
    const headers = await this.getHeaderRow(spreadsheetId);

    const statusColIndex = headers.indexOf('สถานะ');
    const responseTimeColIndex = headers.indexOf('เวลาที่ตอบรับ');

    if (statusColIndex === -1 || responseTimeColIndex === -1) {
      throw new Error('Cannot find required column (สถานะ or เวลาที่ตอบรับ)');
    }

    const targetRow = bookingId + 1;
    const statusColLetter = String.fromCharCode(65 + statusColIndex);
    const responseTimeColLetter = String.fromCharCode(65 + responseTimeColIndex);

    const now = moment().format('DD/MM/YYYY HH:mm');

    // ✅ Step 1: Update both status & response time
    const dataRange = `${this.sheetName}!${statusColLetter}${targetRow}:${responseTimeColLetter}${targetRow}`;
    await this.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: `${this.sheetName}!${statusColLetter}${targetRow}`,
            values: [[newStatus]],
          },
          {
            range: `${this.sheetName}!${responseTimeColLetter}${targetRow}`,
            values: [[now]],
          },
        ],
      },
    });

    // ✅ Step 2: Read full row to return
    const fullRowRange = `${this.sheetName}!A${targetRow}:Z${targetRow}`;
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: fullRowRange,
    });

    const rowValues = res.data.values?.[0] || [];
    const rowObject: Record<string, string> = {};
    headers.forEach((header, index) => {
  let value = rowValues[index] || '';

  if (header === 'หมายเลขการจอง') {
    // Pad to 3 digits if it's a number
    const number = parseInt(value, 10);
    value = isNaN(number) ? value : number.toString().padStart(3, '0');
  }

  rowObject[header] = value;


    });

    return rowObject;
  }
}
