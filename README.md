# ✨ Website Builder Pro

A professional, high-performance low-code platform for creating modern, responsive web layouts with a refined drag-and-drop experience.

---

## 🚀 Core Features

- **Intuitive Drag & Drop** – Precise widget placement, resizing, and repositioning using `@dnd-kit`.
- **Zero-Gap Containers** – Optimized layouts that utilize 100% of available space with smart padding management.
- **Enterprise-Grade Auth** – Seamless SSO integration via **Auth0** for secure, multi-provider access.
- **Cloud Persistence** – Automatic layout synchronization with **MongoDB** for reliable design storage.
- **Premium Aesthetics** – Stunning dark-mode interface with glassmorphism, smooth transitions, and modern typography.
- **Responsive Architecture** – Full support for sections and containers that adapt to various screen sizes.

---

## 📂 Project Structure

```text
saasant/
├── client/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # Modular widget and UI library
│   │   ├── services/    # API and Auth integration
│   │   └── hooks/       # Custom layout and state management logic
│
├── server/              # Express + Node.js Backend
│   ├── models/          # MongoDB schemas (Mongoose)
│   ├── routes/          # API endpoints for layout persistence
│   └── middleware/      # Auth0 JWT verification
```

---

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas cluster
- **Auth0**: An active tenant with a Single Page Application (SPA) and an API configured

### 1. Backend Configuration
Navigate to the `server` directory, install dependencies, and configure environment variables:

```bash
cd server
npm install
cp .env.example .env
```

Update `.env` with your secure credentials:
- `MONGODB_URI`: Your MongoDB connection string
- `AUTH0_DOMAIN`: Your Auth0 tenant domain
- `AUTH0_AUDIENCE`: Your Auth0 API Identifier

### 2. Frontend Configuration
Navigate to the `client` directory and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

### 3. Execution
Start both the server and client in development mode:

```bash
# Server terminal
npm run dev

# Client terminal
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the next available port).

---

## 🧹 Optimization & Performance

We maintain a high standard of code quality. Recent optimizations include:
- **Dependency Thinning**: Removed 5+ unused packages to reduce security surface and bundle size.
- **Widget Refactoring**: Consolidated widget logic into `DroppedWidget.jsx`, removing redundant specific implementation files.
- **Layout Logic**: Eliminated unnecessary paddings and bottom-gaps in containers and the main canvas for maximum layout flexibility.

---

## 🛡️ License

Built with ❤️ for pro developers and designers. Distributed under the **MIT License**.
