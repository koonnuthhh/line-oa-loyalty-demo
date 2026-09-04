# 📱 LINE LIFF Integration Guide

This README describes how to implement and use the LINE LIFF (LINE Front-end Framework) integration for automatic Wi-Fi credential delivery through a LINE bot.

---

## 🔧 What is LINE LIFF?

LIFF is a web app platform provided by LINE that lets users interact with web pages inside the LINE app. In this project, LIFF is used to allow users to request Wi-Fi credentials.

---

## 🧱 Project Structure

* `liff.controller.ts`: Renders the LIFF page and handles the incoming request.
* `liff.service.ts`: Handles the logic of requesting Wi-Fi credentials and sending them via LINE.
* `liff.module.ts`: Registers the controller and service.

---

## 🚀 How It Works

### 1. QR Code / Link Scan

The user scans a QR code that links to a LIFF page such as:

```
https://liff.line.me/{LIFF_ID}?liff.state=branch-123_botId-Uxxxxxxxx
```

### 2. LIFF Page Rendering

The backend handles `GET /liff` or `GET /liff/:state` and:

* Parses `liff.state` to extract `branchId` and `botId`
* Selects the appropriate LIFF ID based on botId
* Returns the `liffId`, `state`, and backend API URL

```ts
@Get('liff')
@Render('liff')
getLiffPage(@Query('liff.state') state: string) {...}
```

### 3. User Submits Request

The LIFF frontend gathers:

* `userId`
* `displayName`
* `botId`
* `branchId`
* `formattedDate`

...and POSTs it to `POST /wifi-request`

### 4. Backend Logic

The `LiffService.sendWifiToUser()` method:

1. Sends the request to Hotspot backend: `POST /hotspot/Request-wifi`
2. Gets back Wi-Fi credentials (`username`, `password`, `Time`)
3. Pushes a message to the user via the correct LINE bot

---

## 🔐 Environment Variables

Required environment variables:

```
VERDANT_LINE_LIFF_ID=...
AURORA_LINE_LIFF_ID=...
AURORA_UID=...
BASE_URL=https://your-backend-url.com
HOTSPOT_API_BASE_URL=https://your-hotspot-api.com
```

Bot credentials are stored in:

* `Line_Verdant.config.ts`
* `Line_Aurora.config.ts`

---

## 📦 Example Payload Sent to /wifi-request

```json
{
  "user": { 
    "userId": "Uxxxxxxxx",
    "destination": "Uyyyyyyyy",
    "branchId": "123",
    "username": "John Doe"
  },
  "content": {
    "formattedDate": "07/24/2025 08:30"
  }
}
```

---

## 💬 Output to User via LINE

```
Hi John Doe

your Wi-Fi username: abc123
password: change-me
valid for: 30m
```

---

Let me know if you'd like to generate a sample LIFF page UI or Postman test collection.
