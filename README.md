# 🏛️ HeritageWalk

**A Community-Based Heritage Documentation Web Platform**

HeritageWalk is a full-stack web platform where people can discover, learn about, and contribute to documenting India's local heritage sites — from ancient stepwells and temples to havelis, forts, and colonial-era buildings.

---

## ✨ Features

- **🔍 Explore & Filter** — Browse heritage sites with category chips, keyword search, city/state filtering, and regional filters.
- **🗺️ Interactive India Map** — Custom Leaflet map with type-coded monument markers strictly bounded to India.
- **📖 Rich Site Archives** — Detailed monument pages with historical narratives, travel tips, and responsive photo galleries.
- **📸 Community Contributions** — Explorers can upload original photos, suggest unlisted sites, or submit historical corrections.
- **🛡️ Curator & Admin Portal** — Secure moderation console to review, approve, or reject submissions before publication.
- **❤️ Explorer Profiles & Wishlists** — Personal passports for saving bookmarked sites and tracking submitted contributions.
- **📱 Fully Responsive** — Seamless mobile, tablet, laptop, and desktop experiences with touch-friendly navigation.
- **🎨 Warm Heritage Aesthetic** — Earthy palette with typography and subtle animations.

---

## 🛠️ Tech Stack

| Layer       | Technology                                                |
| ----------- | --------------------------------------------------------- |
| **Frontend**| React 18, Vite, React Router 6, Leaflet, CSS3 Custom Vars |
| **Backend** | Node.js, Express.js, Multer (Memory Storage)              |
| **Database**| MongoDB, Mongoose 7                                       |
| **Auth**    | JWT (JSON Web Tokens), Bcrypt.js                          |
| **Storage** | Local disk uploads (with optional Cloudinary fallback)    |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally or MongoDB Atlas connection string)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Heritage_Walk
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   *(or run `npm install` in the root, `client`, and `server` folders)*

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Verify or update values in `.env`:
   - `MONGODB_URI`: MongoDB connection string
   - `PORT`: Express server port (default: `5000`)
   - `JWT_SECRET`: Secret key for signing tokens
   - `CLIENT_URL`: Client URL for CORS in production

4. **Start Development**
   ```bash
   npm run dev
   ```
   This runs both services concurrently:
   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api`

---

## 📁 Project Structure

```
Heritage_Walk/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, Footer, SiteCard, etc.)
│   │   ├── config/              # Centralized API configuration (api.js)
│   │   ├── context/             # React Context providers (AuthContext.jsx)
│   │   ├── data/                # Verified heritage fallback dataset (fallbackSites.js)
│   │   ├── pages/               # Application views (Home, Explore, SiteDetail, Admin, etc.)
│   │   ├── services/            # Decoupled API service layer (authService, siteService, etc.)
│   │   ├── App.jsx              # Routes and layout wrapper
│   │   ├── index.css            # Global design tokens and responsive utilities
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json              # Vercel deployment rewrites
│   └── package.json
│
├── server/                      # Express Backend
│   ├── config/                  # Database connection and auto-seeding (db.js)
│   ├── middleware/              # Authentication & authorization guards (auth.js)
│   ├── models/                  # Mongoose schemas (Site.js, User.js, Contribution.js)
│   ├── routes/                  # Express route controllers (auth.js, sites.js, contributions.js)
│   ├── seed/                    # Database seeding dataset and scripts
│   ├── tests/                   # Automated node:test test suite
│   ├── uploads/                 # Local uploaded images/videos directory
│   ├── utils/                   # Geocoding and helper utilities
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json                 # Monorepo task orchestration scripts
└── README.md
```

---

## 🌐 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint                    | Description                           | Access  |
| ------ | --------------------------- | ------------------------------------- | ------- |
| `POST` | `/api/auth/register`        | Create new explorer account           | Public  |
| `POST` | `/api/auth/login`           | Login and receive JWT token           | Public  |
| `GET`  | `/api/auth/me`              | Get authenticated profile & wishlist  | Private |
| `PUT`  | `/api/auth/profile`         | Update profile bio / location         | Private |
| `POST` | `/api/auth/wishlist/:id`    | Toggle site saved in wishlist         | Private |

### Heritage Sites (`/api/sites`)
| Method | Endpoint                    | Description                           | Access  |
| ------ | --------------------------- | ------------------------------------- | ------- |
| `GET`  | `/api/sites`                | List sites (filter, search, paginate) | Public  |
| `GET`  | `/api/sites/featured`       | Get curated featured monuments        | Public  |
| `GET`  | `/api/sites/types`          | Get distinct monument categories      | Public  |
| `GET`  | `/api/sites/:slug`          | Get site details by slug              | Public  |

### Community Contributions (`/api/contributions`)
| Method  | Endpoint                         | Description                          | Access     |
| ------- | -------------------------------- | ------------------------------------ | ---------- |
| `POST`  | `/api/contributions`             | Submit new media, info, or monument  | Explorer   |
| `GET`   | `/api/contributions/mine`        | Get current user's submissions       | Explorer   |
| `GET`   | `/api/contributions`             | List all contributions               | Public/All |
| `PATCH` | `/api/contributions/:id/review`  | Approve or reject contribution       | Admin      |
| `DELETE`| `/api/contributions/:id`         | Delete contribution record           | Admin      |

---

## 🧪 Testing

Run backend automated tests:
```bash
cd server
npm test
```

Build frontend for production:
```bash
npm run build
```

---