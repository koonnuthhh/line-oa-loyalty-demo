# 🚗 LINE Loyalty Backend – Verdant & Aurora

This project is the backend service for the LINE-based loyalty and customer engagement system, supporting multiple automotive brands including **Verdant** and **Aurora**. It is built with [NestJS](https://nestjs.com/) and integrates with the LINE Messaging API to deliver interactive experiences to users.

---

## 🧱 Project Structure

- [`src/verdant/`](/src/verdant/) – Verdant brand logic (controller, service, handlers)
- [`src/Aurora/`](/src/Aurora/) – Aurora brand logic (controller, service, handlers)
- [`src/data/`](/src/data/) – Static data for branches, centers, test drives, etc.
- [`src/Utils/`](/src/Utils/) – Shared utility functions and types
- [`src/Usersession/`](/src/Usersession/) – User session management
- [`config/`](/config/) – Brand and API configuration files

---

## 🚦 Supported Features

- **Brand-specific Menus & Promotions:** Dynamic menu and promotion handling for each brand.
- **Service Center Information:** Lookup and display of service center locations and details.
- **Test Drive Booking:** Collect and process test drive requests.
- **Branch & Center Data:** Serve up-to-date information about branches and service centers.
- **User Session Management:** Track user interactions and sessions for personalized experiences.
- **Sub system:** There are more sub system to make this demo more complete 

---

## 🏗️ How It Works
### 1. LINE Webhook Integration

Each brand has its own LINE bot. The backend receives webhook events (messages, postbacks, etc.) from LINE and routes them to the appropriate brand handler.

- **Verdant:** [`src/verdant/verdant.controller.ts`](src/verdant/verdant.controller.ts)
- **Aurora:** [`src/Aurora/Aurora.controller.ts`](src/Aurora/Aurora.controller.ts)

### 2. Brand-specific Logic

Handlers in each brand module process user actions:

- Menu navigation
- Promotion requests
- Service center lookups
- Test drive bookings
- Other custom flows

Handlers are organized in the `*Handlers/` directories within each brand module. For example in Aurora : [`/src/Aurora/AuroraHandlers/`](/src/Aurora/AuroraHandlers/)

### 3. Data Management

Static data (branches, centers, test drive options) is stored in [`src/data/`](/src/data/) and imported as needed by handlers.

### 4. Utility Functions

Common logic (date formatting, message construction, session storage) is implemented in [`src/Utils/`](/src/Utils/).

### 5. State handler

Use usersession to store answer of each user and keep track of there interaction base on answer they are on. you can see the session class in [`src/Usersession/session.service.ts`](/src/Usersession/session.service.ts).

---

## ⚙️ Configuration

Brand and API credentials are managed in the `config/` directory:

- `Line_Verdant.config.ts`
- `Line_Aurora.config.ts`
- Other API configs as needed

Update these files with the correct LINE bot/channel credentials and API endpoints.

---

## 📝 Example: Service Center Lookup Flow

1. User selects "Service Center" from the LINE menu.
2. Backend receives the event and routes to the brand's `handleServiceCenter` handler.
3. Handler fetches relevant data from `src/data/` and constructs a LINE Flex Message.
4. User receives a rich message with service center details and options.

---

## 🧩 Extending for New Brands

To add a new brand:

1. Create a new module in `src/` (e.g., `src/newbrand/`)
2. Implement controller, service, and handlers following the Verdant/Aurora pattern.
3. Add brand configuration in [`config/`](/config/).
4. Register the module in [`src/app.module.ts`](/src//app.module.ts).

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

Environment variables (see `.env.example` or config files) must be set for LINE and API credentials.

---

## 📁 Directory Overview

```
src/
  Aurora/
    Aurora.controller.ts
    Aurora.service.ts
    AuroraHandlers/
  verdant/
    verdant.controller.ts
    verdant.service.ts
    verdantHandlers/
  data/
    [brand and service center data]
  Utils/
    [shared functions and types]
  Usersession/
    [session management]
config/
  [brand and API configs]
```

Let me know if you want to add more details, such as specific API endpoints, or if you want a section for contributing or deployment!

---

## There are more sub-system behind this

For information about the WIFI system, see [README.md](../hotspot-backend/README.md)

For information about the LIFF system, see [`README-liff.md`](./README-liff.md).

For information about the test-drive system, see


---
