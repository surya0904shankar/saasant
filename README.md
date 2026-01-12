# Website Builder - Low-Code Platform

A professional website builder with drag-and-drop functionality, Auth0 SSO, and cloud-based layout persistence.

## 🚀 Features

- **Drag-and-Drop Interface** - Intuitive widget placement using @dnd-kit
- **Auth0 SSO** - Secure authentication with Auth0 (supports Google, GitHub, etc.)
- **Cloud Persistence** - Layouts saved to MongoDB
- **Modern UI** - Premium dark theme with glassmorphism effects
- **Widget Library** - Text, Image, Button, and Navbar widgets

## 📁 Project Structure

```
saasant/
├── client/          # React Frontend (Vite)
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       └── services/
│
├── server/          # Node.js Backend (Express)
│   ├── config/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Auth0 account

### 1. Configure Auth0

1. Go to [auth0.com](https://auth0.com) and create an account
2. Create a new **Single Page Application**
3. Note your **Domain** and **Client ID**
4. Go to **Applications → APIs** and create an API:
   - Name: `Website Builder API`
   - Identifier: `https://website-builder-api`
5. Configure allowed URLs in your application settings:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# AUTH0_DOMAIN=your-tenant.auth0.com
# AUTH0_AUDIENCE=https://website-builder-api
# MONGODB_URI=mongodb://localhost:27017/website-builder

npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install

# Create .env file with Auth0 credentials:
echo "VITE_AUTH0_DOMAIN=your-tenant.auth0.com" > .env
echo "VITE_AUTH0_CLIENT_ID=your-client-id" >> .env
echo "VITE_AUTH0_AUDIENCE=https://website-builder-api" >> .env

npm run dev
```

### 4. Access the Application

Open http://localhost:5173 in your browser.

## 🔧 Environment Variables

### Server (.env)
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH0_DOMAIN` | Auth0 tenant domain (e.g., `your-tenant.auth0.com`) |
| `AUTH0_AUDIENCE` | Auth0 API identifier |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |

### Client (.env)
| Variable | Description |
|----------|-------------|
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID |
| `VITE_AUTH0_AUDIENCE` | Auth0 API identifier |
| `VITE_API_URL` | Backend API URL (optional) |

## 📖 Usage

1. **Sign In** - Click "Continue with Auth0" to authenticate
2. **Add Widgets** - Drag widgets from the sidebar to the canvas
3. **Edit Widgets** - Click on text to edit, double-click buttons to rename
4. **Reposition** - Drag widgets around the canvas
5. **Delete** - Hover over a widget and click the X button
6. **Save** - Click "Save Layout" to persist your design

## 🔐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/layout/save-layout` | Save user layout (requires Auth0 token) |
| `GET` | `/api/layout/get-layout` | Get user layout (requires Auth0 token) |

## 📄 License

MIT License
