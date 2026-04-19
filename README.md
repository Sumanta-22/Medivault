# 🏥 MediVault — Your Medical Records, Secured

[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**MediVault** is a modern, secure, and intuitive web application designed to help individuals and families digitally store, organize, and access their medical history. With integrated AI summaries and emergency support, MediVault ensures your health data is always at your fingertips when you need it most.

---

## ✨ Key Features

- **🔐 Secure Authentication**: Robust login and registration system using JWT tokens and encrypted passwords.
- **📁 Smart Folder Management**: Categorize your records (Blood Tests, Prescriptions, X-Rays, etc.) with a clean, color-coded interface.
- **📄 Document Vault**: Upload and store medical documents securely.
- **🤖 AI-Powered Summaries**: Instantly generate concise summaries of complex medical reports using **Google Gemini AI**.
- **🆘 Emergency Medical Profile**: A dedicated section for critical health info (Blood Group, Allergies, Medications) accessible in seconds.
- **🪪 Digital Medical ID**: Generate a unique **QR code** for your medical profile for quick access by first responders.
- **📥 PDF Export**: Export your complete health summary as a professional PDF report for sharing with doctors.
- **👨‍👩‍👧‍👦 Family Accounts**: Manage multiple health profiles under a single family account.
- **🌓 Dynamic UI**: A premium dark-themed interface with smooth animations powered by **Framer Motion**.

---

## 🚀 Tech Stack

The application has been decoupled into a dedicated frontend and backend architecture to ensure scalability and clear separation of concerns.

### Frontend (`client/`)
- **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API (`AuthContext`)
- **Animation & Icons**: [Framer Motion](https://www.framer.com/motion/) & [Lucide React](https://lucide.dev/)
- **Utilities**: [jsPDF](https://github.com/parallax/jsPDF) (PDF Export), [qrcode.react](https://zpao.github.io/qrcode.react/) (Medical ID generation)

### Backend (`server/`)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Data Storage**: Local JSON File Store (`medivault-db.json`) for seamless portability.
- **Authentication**: Custom JWT implementation using `jsonwebtoken` and `bcryptjs`.
- **AI Integration**: [Google Gemini Pro API](https://ai.google.dev/) (SDK fallback to mock data if API key is not present)

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)

### Installation & Running

Because the application is decoupled, you need to run both the frontend and backend servers.

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/medivault.git
   cd medivault
   ```

2. **Start the Backend Server**
   Open a terminal and start the Express API:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   *The backend will run on `http://localhost:3001`.*

3. **Start the Frontend Application**
   Open a **new** terminal tab and start the React app:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`. API requests are automatically proxied to the backend.*

---

## 📂 Project Structure

```text
├── client/              # React + Vite Frontend
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context (Auth)
│   │   ├── pages/       # Route-level components
│   │   ├── App.jsx      # React Router configuration
│   │   └── main.jsx     # Vite App entry point
│   ├── tailwind.config.js
│   └── vite.config.js   # Contains proxy setup for backend
│
├── server/              # Express.js Backend
│   ├── lib/             # Data store utilities
│   ├── middleware/      # JWT authentication wrappers
│   ├── routes/          # Express route handlers (auth, folders, upload, etc)
│   └── index.js         # API Entry point
│
└── medivault-db.json    # Local JSON database (No DB setup required!)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for a healthier world.</p>
