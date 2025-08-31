# Healthcare Communication Dashboard

A full-stack healthcare communication management system with FHIR integration.

## 🏗 Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Firebase
- **Database**: Firestore
- **Integration**: FHIR R4 Standard

## 📁 Project Structure
├── frontend/     # React application
├── backend/      # Express server + Firebase functions
├── shared/       # Shared types and utilities
├── design/       # Design assets and mockups
└── docs/         # Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- Firebase CLI
- Git

### Installation

1. Clone and install dependencies:
\`\`\`bash
git clone [repository-url]
cd COMP3820-CODETRIO
npm run install:all
\`\`\`

2. Set up environment variables:
\`\`\`bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
\`\`\`

3. Start development servers:
\`\`\`bash
npm run dev
\`\`\`

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 👥 Team

- **Designer**: [Name]
- **Frontend Developer**: [Name]
- **Backend Developer**: [Name]

## 📝 Development Workflow

1. Create feature branch
2. Make changes
3. Submit pull request
4. Code review
5. Merge to main

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [FHIR Integration](./docs/FHIR-INTEGRATION.md)