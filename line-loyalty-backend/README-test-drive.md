# 🚗 Test Drive Booking System – LINE Loyalty Backend

This document describes the test drive booking subsystem for the LINE Loyalty backend, supporting multiple automotive brands (Nimbus, MERIDIAN, VECTOR, Zephyr) and integrating with the LINE Messaging API for seamless user experience.

---

## 🧱 Project Structure

- [`src/data/`](/src/data/) – Static data for test drive vehicles and branches per brand
- [`src/Utils/functions/askAndAnswerQuestion.ts`](/src/Utils/functions/askAndAnswerQuestion.ts) – Core Q&A and booking logic
- [`src/Aurora/AuroraHandlers/handleTestDrive.ts`](/src/Aurora/AuroraHandlers/handleTestDrive.ts) – Handler for test drive menu and vehicle selection
- [`src/GoogleSheet/google-sheet.service.ts`](/src/GoogleSheet/google-sheet.service.ts) – Google Sheets integration for booking records
- [`src/Usersession/session.service.ts`](/src/Usersession/session.service.ts) – User session and state management

---

## 🚦 Supported Features

- **Multi-brand Test Drive Booking:** Users can book test drives for Nimbus, MERIDIAN, VECTOR, and Zephyr vehicles via LINE.
- **Dynamic Vehicle & Branch Selection:** Vehicle and branch options are dynamically loaded per brand.
- **Step-by-step Q&A Flow:** Collects all required booking details interactively.
- **Google Sheets Integration:** Bookings are saved to brand-specific Google Sheets for admin follow-up.
- **Admin Notification:** Admins are notified of new bookings via LINE push message.

---

## 🏗️ How It Works

### 1. User Initiates Test Drive Booking

- User selects "ทดลองขับ" (Test Drive) from the LINE menu.
- The backend responds with a list of available brands and vehicles.

### 2. Step-by-step Booking Flow

The booking process is managed by a Q&A flow defined in [`src/data/Question.ts`](src/data/Question.ts):

1. **เลือกรถยนต์ที่ต้องการทดลองขับ** (Choose vehicle)
2. **ชื่อ - นามสกุล** (Full name)
3. **เบอร์โทรศัพท์** (Phone number)
4. **สาขาที่ต้องการทดลองขับ** (Choose branch)
5. **วันเวลาที่นัดหมาย** (Pick date & time)

Each answer is stored in the user session until the flow is complete.

### 3. Data Sources

- **Vehicles per brand:**
  - Nimbus: [`src/data/ืnimbusDrivetest.ts`](src/data/ืnimbusDrivetest.ts)
  - MERIDIAN: [`src/data/meridianDrivetest.ts`](src/data/meridianDrivetest.ts)
  - VECTOR: [`src/data/ืvectorDrivetest.ts`](src/data/ืvectorDrivetest.ts)
  - Zephyr: [`src/data/zephyrDrivetest.ts`](src/data/zephyrDrivetest.ts)
- **Branches per brand:**
  - Nimbus: [`src/data/nimbusbranch.ts`](src/data/nimbusbranch.ts)
  - MERIDIAN: [`src/data/meridianbranch.ts`](src/data/meridianbranch.ts)
  - VECTOR: [`src/data/vectorbranch.ts`](src/data/vectorbranch.ts)
  - Zephyr: [`src/data/zephyrbranch.ts`](src/data/zephyrbranch.ts)

### 4. Booking Submission & Storage

- When all questions are answered, the booking is saved to a Google Sheet specific to the brand via [`GoogleSheetService.appendRow()`](src/GoogleSheet/google-sheet.service.ts).
- The user receives a booking summary and reference number.
- Admins receive a LINE push notification with booking details.

### 5. Session Management

- User answers are tracked in-memory using [`SessionService`](src/Usersession/session.service.ts).
- Session is cleared after booking is complete or reset.

---

## ⚙️ Configuration

- Google Sheets credentials: [`src/GoogleSheet/google-sheets-key.json`](src/GoogleSheet/google-sheets-key.json)
- Brand and API credentials: see `config/` directory

---

## 📝 Example: Test Drive Booking Flow

1. User selects "ทดลองขับ" from the LINE menu.
2. System prompts for vehicle selection (brand/model).
3. User provides name and phone number.
4. System prompts for branch selection.
5. User picks date and time (via Flex Message date picker).
6. Booking is saved and both user and admin are notified.

---

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Start the server (development)
npm run start:dev

# Build for production
npm run build
```

---

## 📁 Directory Overview

```
src/
  data/
    [test drive vehicles and branches]
  Utils/
    functions/
      askAndAnswerQuestion.ts
  Aurora/
    AuroraHandlers/
      handleTestDrive.ts
  GoogleSheet/
    google-sheet.service.ts
    google-sheets-key.json
  Usersession/
    session.service.ts
```

---

## 🔗 Related Subsystems

- For the main loyalty backend, see [README.md](./README.md)
- For the LIFF system, see [README-liff.md](./README-liff.md)
- For the Wi-Fi system, see [../hotspot-backend/README.md](../hotspot-backend/README.md)

---

Let us know if you need more details, sample payloads, or API endpoint documentation!
