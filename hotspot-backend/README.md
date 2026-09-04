# Hotspot Backend & Wi-Fi Database Integration

This `README-hotspot.md` explains the interaction between the **Hotspot Backend** and the **Wi-Fi Database**.

It is divided into two main parts:

---

## 🔌 Connect Database

This project uses **PostgreSQL** by default.

If you wish to change the database type, go to `app.module.ts` at **line 22** and modify:

```ts
type: "<your_database_type>"
```

> ⚠️ Don't forget: if you're not using a cloud database or need to connect to a local server, update the **Docker configuration** accordingly.

---

## 🗂️ Database Structure (ER Diagram)

This is how the database is structured:

![Diagram](src/assets/Diagram.png)

### 🔗 Summary of Relationships

* `wifihotspot_admin` → `wifihotspot_lineoa` via `lineoa_uid`
* `wifihotspot_branch` → `wifihotspot_lineoa` via `lineoa_id`
* `aurora_sale` → `wifihotspot_lineoa` via `lineoa_id`
* `wifihotspot_wifi_credential` → `wifihotspot_wifi_profile` via `wifi_profile_id`
* `wifihotspot_wifi_usage` links:

  * `wifihotspot_branch` via `branch_id`
  * `wifihotspot_wifi_profile` via `wifi_profile_id`
* `wifihotspot_log` stores `lineoa_uid`, `branch_code` directly (no strict FK)
* `glpi_rating_url` is a standalone table for storing feedback ratings by ticket ID

---

## ⚙️ `.env` File

Check `.env.example` for a template. You must **provide your own values**.

---

## 🚀 Backend Hotspot

You can explore the API by starting the server and visiting:

```
http://localhost:{PORT}/api
```

### 📁 DTOs

Used to define the structure of incoming JSON. Located in the `dto/` folder.

---

### 📂 Controllers

`hotspot.controller.ts` maps endpoints to the corresponding service logic.

---

### 📦 Modules

Handles export and import of components across the application.

---

## 📘 Explanation of `HotspotService` Functions

### `checkAdmin(userId, lineoa_uid)`

Check if a user is an admin for a given Line OA.

### `assignNextWifiCredential(body)`

Assign the next unused Wi-Fi credential to a user based on their profile.

### `saveLogs(...)`

Store credential usage in the log.

### `getLogs(body)`

Get the 50 most recent logs by Line OA or by branch.

### `resetWifi(body)`

Reset usage counter for a single branch or all branches under a Line OA.

### `saveSpameLogs(body)`

If a user spams the system, store a warning log instead of assigning a new credential.

### `findAllUidsFromLineOaUid(lineoaUid)`

Get all admin user IDs associated with a specific Line OA.

---

Let me know if you'd like to generate API documentation or Postman collection for the endpoints.
