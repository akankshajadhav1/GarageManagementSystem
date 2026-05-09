# 🔧 GarageHub — Garage Management System

A complete garage management system built with the **MERN Stack** (MongoDB, Express.js, React 18 + TypeScript, Node.js).

## ✨ Features

- **Authentication** — JWT-based login/register with role-based access control (Admin, Manager, Mechanic, Receptionist)
- **Customer Management** — Full CRUD with search, pagination, and address management
- **Vehicle Management** — Track vehicles with make/model, mileage, fuel type, and service history
- **Service Requests** — Complete workflow (Pending → Diagnosing → In Progress → Completed) with priority levels
- **Dashboard** — Interactive charts (Recharts), stats cards, and recent activity feed
- **Premium UI** — Dark theme with glassmorphism, gradient accents, and smooth animations using Material-UI

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, MUI v5, Redux Toolkit, React Router v6, Recharts |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Express Validator |
| **Database** | MongoDB |
| **DevOps** | Docker, Docker Compose |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd garage-backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd garage-frontend
npm install
npm run dev
```

### Seed Database
```bash
cd garage-backend
npm run seed
```

### Docker
```bash
docker-compose up --build
```


## 📁 Project Structure

```
garage-management-system/
├── garage-backend/          # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── middleware/      # Auth & error middleware
│   │   ├── utils/           # JWT, validators
│   │   └── seeds/           # Database seeder
│   ├── server.js            # Entry point
│   └── .env                 # Environment config
├── garage-frontend/         # React + TypeScript app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API service layer
│   │   ├── store/           # Redux Toolkit store
│   │   ├── hooks/           # Custom React hooks
│   │   └── styles/          # Theme & global CSS
│   └── vite.config.ts
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET/POST | `/api/customers` | List/Create customers |
| GET/PUT/DELETE | `/api/customers/:id` | Get/Update/Delete customer |
| GET/POST | `/api/vehicles` | List/Create vehicles |
| GET/PUT/DELETE | `/api/vehicles/:id` | Get/Update/Delete vehicle |
| GET/POST | `/api/services` | List/Create service requests |
| GET/PUT/DELETE | `/api/services/:id` | Get/Update/Delete service request |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/recent` | Recent activity |

API docs available at: `http://localhost:5000/api-docs` (Swagger UI)

## 📄 License

MIT
