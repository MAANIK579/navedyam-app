# 🍛 Navedyam — Cloud Kitchen App
**Full-stack mobile food ordering app for Navedyam, Bhiwani, Haryana**

---

## 📁 Project Structure

```
navedyam/
├── backend/                  ← Node.js + Express + SQLite API
│   ├── server.js             ← Entry point (runs on port 4000)
│   ├── db/
│   │   └── database.js       ← SQLite schema + auto-seed menu data
│   ├── routes/
│   │   ├── auth.js           ← Register / Login / Profile (JWT)
│   │   ├── menu.js           ← Categories + Menu items
│   │   ├── orders.js         ← Place order / Order history
│   │   └── track.js          ← Real-time order tracking
│   ├── middleware/
│   │   └── auth.js           ← JWT verification middleware
│   └── package.json
│
└── frontend/                 ← React Native (Expo) mobile app
    ├── App.js                ← Root navigator + auth flow
    ├── app.json              ← Expo config
    ├── src/
    │   ├── api/
    │   │   └── client.js     ← All API calls in one place
    │   ├── context/
    │   │   ├── AuthContext.js ← Global user + token state
    │   │   └── CartContext.js ← Global cart state
    │   ├── screens/
    │   │   ├── LoginScreen.js
    │   │   ├── RegisterScreen.js
    │   │   ├── HomeScreen.js
    │   │   ├── MenuScreen.js
    │   │   ├── CartScreen.js
    │   │   ├── TrackScreen.js
    │   │   └── ProfileScreen.js
    │   ├── components/
    │   │   └── index.js      ← Shared UI: Button, Input, Card, VegBadge…
    │   └── theme.js          ← Colors, fonts, spacing
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed on your machine:

| Tool        | Version   | Install link |
|-------------|-----------|--------------|
| Node.js     | v18+      | https://nodejs.org |
| npm         | v9+       | Comes with Node |
| Expo CLI    | latest    | `npm install -g expo-cli` |
| Expo Go app | latest    | Install on your Android/iOS phone from Play Store / App Store |

---

## 🚀 Step 1 — Start the Backend

```bash
cd navedyam/backend
npm install
node server.js
```

You should see:
```
✅ Database seeded with categories and menu items.
🍛 Navedyam API running on http://localhost:4000
```

> The SQLite database file `navedyam.db` is auto-created on first run with all menu items seeded.

### Test the API is working:
Open your browser and visit:
```
http://localhost:4000
```
You should see: `{"status":"ok","app":"Navedyam API","version":"1.0.0"}`

---

## 📱 Step 2 — Configure the Frontend

**Important:** You need to set your machine's local IP address in the frontend so your phone can reach the backend.

1. Find your machine's local IP:
   - **Windows:** Open CMD → type `ipconfig` → look for `IPv4 Address` (e.g. `192.168.1.5`)
   - **Mac/Linux:** Open Terminal → type `ifconfig` or `ip addr` → look for `inet` under your WiFi adapter

2. Open `frontend/src/api/client.js` and update line 6:
```js
// BEFORE (only works in emulator):
const BASE_URL = 'http://localhost:4000/api';

// AFTER (works on real phone — use YOUR IP):
const BASE_URL = 'http://192.168.1.5:4000/api';
```

> ⚠️ Your phone and computer must be on the **same WiFi network**.

---

## 📱 Step 3 — Start the Mobile App

```bash
cd navedyam/frontend
npm install
npx expo start
```

You'll see a **QR code** in the terminal.

- **Android:** Open the **Expo Go** app → tap "Scan QR Code" → scan it
- **iPhone:** Open the **Camera** app → point at the QR code → tap the Expo link

The app will load on your phone! 🎉

---

## 🔑 API Endpoints Reference

### Auth
| Method | Endpoint           | Auth | Description         |
|--------|--------------------|------|---------------------|
| POST   | /api/auth/register | ❌   | Create new account  |
| POST   | /api/auth/login    | ❌   | Login, get JWT      |
| GET    | /api/auth/me       | ✅   | Get my profile      |
| PUT    | /api/auth/me       | ✅   | Update my profile   |

### Menu
| Method | Endpoint               | Auth | Description              |
|--------|------------------------|------|--------------------------|
| GET    | /api/menu/categories   | ❌   | All categories           |
| GET    | /api/menu/items        | ❌   | All items (+ filters)    |
| GET    | /api/menu/items/:id    | ❌   | Single item              |

**Menu filters:** `?category=thali` or `?veg=1`

### Orders
| Method | Endpoint        | Auth | Description         |
|--------|-----------------|------|---------------------|
| POST   | /api/orders     | ✅   | Place a new order   |
| GET    | /api/orders     | ✅   | My order history    |
| GET    | /api/orders/:id | ✅   | Single order detail |

### Tracking
| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| GET    | /api/track/:orderId   | ❌   | Track order by ID        |
| PATCH  | /api/track/:id/status | ❌   | Update order status (admin) |

**Valid statuses:** `placed` → `confirmed` → `preparing` → `out_for_delivery` → `delivered`

---

## 🛠️ Advance an Order Status (Admin / Testing)

To simulate order progression during testing, use this curl command:

```bash
# Replace ORDER_ID with actual UUID from your order
curl -X PATCH http://localhost:4000/api/track/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

Or use **Postman** / **Insomnia** to call the same endpoint.

---

## 🔧 Customisation Guide

### Add / Edit Menu Items
Edit `backend/db/database.js` → find the `seedItems` array → add your dishes.
Then delete `navedyam.db` and restart the server to re-seed.

### Change Delivery Fee or GST
- **Backend:** Edit `routes/orders.js` line with `const deliveryFee = 30`
- **Frontend:** Edit `src/context/CartContext.js` line with `const deliveryFee = 30`

### Change Brand Name / Colors
- Colors: `frontend/src/theme.js`
- App name: `frontend/app.json` → `"name"` field

### Change Port
Set `PORT` environment variable:
```bash
PORT=5000 node server.js
```

---

## 📦 Build for Production (APK / App Store)

Once ready to publish, use EAS Build (Expo's cloud build service):

```bash
npm install -g eas-cli
eas login
eas build --platform android   # builds APK/AAB
eas build --platform ios       # builds IPA (needs Apple Developer account)
```

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| App can't connect to backend | Make sure you updated `BASE_URL` with your local IP |
| `npm install` fails | Make sure you're using Node v18+ |
| Port 4000 already in use | Run `PORT=5000 node server.js` and update `BASE_URL` accordingly |
| Expo QR code not scanning | Make sure phone and PC are on same WiFi |
| Database errors | Delete `navedyam.db` and restart the server |

---

## 💡 Next Steps (Future Features)

- [ ] Push notifications for order status updates (Expo Notifications)
- [ ] Online payment integration (Razorpay)
- [ ] Admin dashboard to manage orders
- [ ] WhatsApp order confirmation
- [ ] Loyalty points system
- [ ] Multiple delivery addresses

---

*Built with ❤️ for Navedyam Cloud Kitchen, Bhiwani, Haryana*
