<div align="center">

# 🎓 Concept Market

### A Real-Time Hour Allocation Platform for Student Projects

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://concept-market-20e5a.web.app) · [Report Bug](https://github.com/lussepolo/Concept-Market/issues) · [Request Feature](https://github.com/lussepolo/Concept-Market/issues)

</div>

---

## 📖 About

**Concept Market** is an interactive platform designed for the **Festival of Learning** event. Families allocate "hours" to Middle School and High School student projects they want to support, creating a live, engaging voting experience.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🕐 **Hour Allocation** | Each family receives 24 hours to distribute across up to 5 projects |
| 📊 **Live Leaderboard** | Real-time ranking of projects by total hours received |
| 🔐 **Code-Based Access** | Secure login with unique 6-character access codes |
| 👨‍👩‍👧 **Self-Registration** | Families claim codes and register their own names |
| 🛠️ **Admin Dashboard** | Generate codes, manage users, seed database, export CSV |
| ⚡ **Real-Time Sync** | Powered by Firebase Firestore for instant updates |

---

## 🖼️ Screenshots

<details>
<summary>Click to view screenshots</summary>

### Login Screen
Families enter their unique access code to begin.

### Projects View
Browse and allocate hours to student projects.

### Leaderboard
Live ranking of top projects by hours allocated.

### Admin Panel
Manage families, generate codes, and control the system.

</details>

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Firebase Account](https://firebase.google.com/) (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/lussepolo/Concept-Market.git
cd Concept-Market

# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** (start in test mode)
3. Register a **Web App** and copy the config
4. Update `services/config.ts` with your credentials:

```typescript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

---

## 📦 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
# Login to Firebase (first time only)
npx firebase-tools login

# Deploy
npx firebase-tools deploy --only hosting --project your-project-id
```

---

## 🔧 Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `MAX_HOURS` | `24` | Total hours each family can allocate |
| `MAX_PROJECTS` | `5` | Maximum projects a family can support |

Configure in `services/storage.ts`.

---

## 👤 Usage

### For Families

1. Enter your access code at login
2. First time? Add your family name
3. Browse projects and allocate hours
4. Check the leaderboard for live rankings

### For Administrators

1. Login with code: `ADMIN`
2. **Seed Projects** - Upload all 72 student projects
3. **Generate Codes** - Create codes for families (e.g., 350)
4. **Export CSV** - Download all codes for distribution
5. **Delete Users** - Remove families if needed

---

## 🏗️ Tech Stack

```
├── Frontend
│   ├── React 18
│   ├── TypeScript
│   ├── Tailwind CSS
│   └── Lucide Icons
│
├── Backend
│   └── Firebase Firestore (real-time database)
│
├── Build
│   └── Vite
│
└── Hosting
    └── Firebase Hosting
```

---

## 📁 Project Structure

```
Concept-Market/
├── components/
│   ├── Admin.tsx       # Admin dashboard
│   ├── Login.tsx       # Two-step login flow
│   ├── Modal.tsx       # Hour allocation modal
│   └── ProjectCard.tsx # Project display card
├── services/
│   ├── config.ts       # Firebase configuration
│   ├── data.ts         # Seed data (72 projects)
│   ├── firebase.ts     # Firebase initialization
│   └── storage.ts      # Data operations & API
├── App.tsx             # Main application
├── types.ts            # TypeScript interfaces
└── index.tsx           # Entry point
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built for the **Festival of Learning** event
- Designed to showcase student innovation and creativity
- Inspired by fintech investment platforms

---

<div align="center">

**Made with ❤️ for Education**

[⬆ Back to Top](#-concept-market)

</div>
