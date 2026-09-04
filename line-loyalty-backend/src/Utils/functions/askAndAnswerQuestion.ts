import { Client } from '@line/bot-sdk';
import * as moment from 'moment'; // Ensure moment is installed for formatting
import { QUESTIONS } from 'src/data/Question';
import { replyFlex, replyText } from './replyFunction';
import { getButtonOptionsFlexContent } from './flexMessage';
import { nimbusbranch } from 'src/data/nimbusbranch';
import { getDatetimePickerFlexContent } from './datetimepicker';
import { SessionService } from 'src/Usersession/session.service';
import { GoogleSheetService } from 'src/GoogleSheet/google-sheet.service';
import { HotspotService } from 'src/hotspot/hotspot.service';
import { meridianbranch } from 'src/data/meridianbranch';
import { vectorbranch } from 'src/data/vectorbranch';
import { zephyrbranch } from 'src/data/zephyrbranch';


export async function askAndAnswerQuestion(
  client: Client,
  replyToken: string,
  userId: string,
  message: string,
  destination: string,
  brand: string,
  services: {
    sessionService: SessionService,
    googleSheetsService: GoogleSheetService,
    hotspotService: HotspotService
  }
): Promise<void> {
  const { sessionService, googleSheetsService, hotspotService } = services;
  let session = sessionService.get(userId);

  if (!session) {
    session = {
      questionIndex: 0,
      answers: [],
    };
    sessionService.create(userId, session);
  }

  const currentIndex = session.questionIndex;
  // Save previous answer
  if (currentIndex > 0) {
    const lastQuestion = QUESTIONS[currentIndex - 1];
    session.answers.push({ question: lastQuestion, answer: message });
    session.questionIndex++;
    sessionService.update(userId, session);
    if (lastQuestion.includes('สาขาที่ต้องการทดลองขับ')) {
      let branches: string[] = [];

      switch (brand) {
        case 'Zephyr': {
          branches = zephyrbranch;
          break;
        }

        case 'VECTOR': {
          branches = vectorbranch;
          break;
        }

        case 'MERIDIAN': {
          branches = meridianbranch;
          break;
        }

        case 'Nimbus': {
          branches = nimbusbranch;
          break;
        }

        default: {
          return;
        }

      }
      if (branches.length === 1) {
        await client.pushMessage(userId, {
          type: 'text',
          text: `กรุณามาที่สาขา: ${message}`
        });
      } else {
        await client.pushMessage(userId, {
          type: 'text',
          text: `คุณเลือก: ${message}`
        });
      }

    } else if (
      lastQuestion.includes('กรุณาเลือกรถยนต์') ||
      lastQuestion.includes('วันเวลาที่นัดหมาย')
    ) {
      await client.pushMessage(userId, {
        type: 'text',
        text: `คุณเลือก: ${message}`
      });

    }
  }


  // END of questions, process submission
  if (currentIndex >= QUESTIONS.length) {
    sessionService.clear(userId);

    const displayName = await client.getProfile(userId)
      .then(p => p.displayName)
      .catch(() => 'Unknown');

    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const answerMap: Record<string, string> = {
      'Customer Line UID': userId,
      'displayname': displayName,
      'สถานะ': 'รอดำเนินการ',
      // 'lineOA_id': destination,
      'เวลาที่ลูกค้าจอง': nowTime,
      'เวลาที่ตอบรับ': '',
      'ระยะเวลาที่ตอบกลับ': '',
      'ผู้รับผิดชอบ': ''
    };

    for (const entry of session.answers) {
      answerMap[entry.question] = entry.answer;
    }

    let savedRow: string[] = [];

    try {
      const result = await googleSheetsService.appendRow(brand, answerMap);
      savedRow = result.savedRow;
      console.log(result);
      console.log('✅ Booking saved to Google Sheet.');
    } catch (error) {
      console.error('❌ Error saving to Google Sheet:', error);
    }

    const bookingNo = savedRow[0] || 'ไม่ทราบ';
    const customerName = answerMap['ชื่อ - นามสกุล'] || '';
    const car = answerMap['กรุณาเลือกรถยนต์ที่ท่านต้องการทดลองขับ'] || '';
    const phone = answerMap['เบอร์โทรศัพท์'] || '-';
    const branch = answerMap['สาขาที่ต้องการทดลองขับ'] || '';
    const datetime = answerMap['วันเวลาที่นัดหมาย\n(ตั้งแต่เวลา 9:00-17:00 น. หยุดทุกวันอาทิตย์)'] || '';
    const lineName = answerMap['displayname'] || '';
    const status = answerMap['สถานะ'];

    const userSummary =
      `หมายเลขนัดหมายของท่านคือ ${bookingNo}\n` +
      `จะมีเจ้าหน้าที่ติดต่อกลับท่านโดยเร็วที่สุด เพื่อแจ้งเวลานัดหมาย\n` +
      `ขอบพระคุณที่ไว้วางใจร่วมทดสอบรถกับเรา`;

    await replyText(client, replyToken, userSummary);

    const adminUids = await hotspotService.getAdminUids(destination);
    const adminSummary =
      `มีหมายเลขการจองเพิ่มเข้ามาใหม่\n` +
      `หมายเลขการจอง: ${bookingNo} \n` +
      `โดยการจองของคุณ ${customerName}\n` +
      `ชื่อไลน์: ${lineName}\n` +
      `รถที่ต้องการทดลอง: ${car}\n` +
      `สาขาที่ทดลอง: ${branch}\n` +
      `เวลาที่สะดวก: ${datetime}\n` +
      `เบอร์โทร: ${phone}\n` +
      `สถานะ: ${status}`;

    for (const adminUid of adminUids) {
      await client.pushMessage(adminUid, {
        type: 'text',
        text: adminSummary,
      });
    }

    return;
  }

  // Continue asking questions
  let nextQuestion = QUESTIONS[currentIndex];

  // Special handling
  if (nextQuestion.includes('วันเวลาที่นัดหมาย')) {
    const flex = getDatetimePickerFlexContent(
      'กรุณาเลือกวันและเวลาที่ต้องการนัดหมาย',
      'เลือกวันเวลา',
      'action=test-drive-choose-datetime-' + brand,
      'datetime',
      moment().add(1, 'day').hour(10).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'),
      moment().add(1, 'day').hour(10).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'),
      moment().add(1, 'year').format('YYYY-MM-DDTHH:mm'),
    );
    await replyFlex(client, replyToken, flex);
  } else if (nextQuestion === 'สาขาที่ต้องการทดลองขับ') {
    let branches: string[] = [];

    switch (brand) {
      case 'Zephyr': {
        branches = zephyrbranch;
        break;
      }

      case 'VECTOR': {
        branches = vectorbranch;
        break;
      }

      case 'MERIDIAN': {
        branches = meridianbranch;
        break;
      }

      case 'Nimbus': {
        branches = nimbusbranch;
        break;
      }

      default: {
        return;
      }

    }
    if (branches.length === 1) {
      const selectedBranch = branches[0];

      // Save answer directly
      //  session.answers.push({ question: nextQuestion, answer: selectedBranch });
      //session.questionIndex++;
      // sessionService.update(userId, session);

      // Ask the next question recursively
      await askAndAnswerQuestion(client, replyToken, userId, selectedBranch, destination, brand, services);
      return;
    } else {
      const flex = getButtonOptionsFlexContent(
        nextQuestion,
        branches.map(branch => ({
          label: branch.length > 20 ? branch.slice(0, 18) + '…' : branch,
          postbackData: `action=test-drive-choose-branch&item=${brand}-${encodeURIComponent(branch)}`
        }))
      );
      await replyFlex(client, replyToken, flex);
      return;
    }


  } else {
    if (nextQuestion.includes('ชื่อ - นามสกุล')) {
      nextQuestion = 'กรุณาระบุชื่อและนามสกุลของท่าน';
    } else if (nextQuestion.includes('เบอร์โทรศัพท์')) {
      nextQuestion = 'กรุณาระบุเบอร์โทรของท่าน';
    }

    await replyText(client, replyToken, nextQuestion);
  }
}

