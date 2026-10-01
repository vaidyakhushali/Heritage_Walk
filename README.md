# 🏛️ HeritageWalk

**A Community-Based Heritage Documentation Web Platform**

HeritageWalk is a full-stack web platform where people can discover, learn about, and contribute to documenting India's local heritage sites — from ancient stepwells to colonial-era buildings.

---

## ✨ Features

- **🔍 Explore** — Browse heritage sites with search and type filtering
- **📖 Learn** — Detailed site pages with history, significance, and photo galleries
- **📸 Contribute** — Submit photographs, information, new site suggestions, or corrections
- **👨‍💼 Admin Review** — Approve/reject community contributions before publication
- **📱 Responsive** — Works beautifully on desktop, tablet, and mobile
- **🎨 Heritage Design** — Warm brown/earthy color palette with professional typography

## 🛠️ Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Frontend  | React 18 + Vite      |
| Backend   | Node.js + Express.js |
| Database  | MongoDB + Mongoose   |
| Uploads   | Multer               |
| Styling   | Normal CSS           |

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or use MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd heritagewalk
   ```

2. **Install all dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB URI if needed.

4. **Seed the database** (adds 8 sample heritage sites)
   ```bash
   cd server && npm run seed
   ```

5. **Start development servers**
   ```bash
   cd .. && npm run dev
   ```

   This starts both:
   - Backend API: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

### Production Build

```bash
cd client && npm run build
cd ../server
NODE_ENV=production npm start
```

## 📁 Project Structure

```
heritagewalk/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer, SiteCard, PhotoGallery, etc.
│   │   ├── pages/           # Home, Explore, SiteDetail, Contribute, About, Admin
│   │   ├── App.jsx
│   │   └── index.css        # Global styles + brown color palette
│   └── index.html
├── server/                  # Express backend
│   ├── models/              # Site, Contribution (Mongoose)
│   ├── routes/              # /api/sites, /api/contributions
│   ├── seed/                # Database seeder with sample data
│   └── server.js
├── .env
└── package.json
```

## 🌐 API Endpoints

### Sites
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/sites`          | List sites (filter/search/paginate) |
| GET    | `/api/sites/featured` | Get featured sites       |
| GET    | `/api/sites/types`    | Get distinct site types  |
| GET    | `/api/sites/:slug`    | Get site by slug         |

### Contributions
| Method | Endpoint                          | Description           |
|--------|-----------------------------------|-----------------------|
| POST   | `/api/contributions`              | Submit contribution   |
| GET    | `/api/contributions`              | List all contributions|
| PATCH  | `/api/contributions/:id/review`   | Approve/reject        |

## 📄 License

MIT License — built with ❤️ for India's heritage.
