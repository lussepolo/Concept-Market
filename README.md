# Concept Market 2025

A real-time investment voting platform for the **Festival of Learning**. Families use "Concept Coins" to invest in Middle and High School student projects.

## Features

- **Real-time Leaderboard**: Votes update instantly across all devices (powered by Firebase).
- **Fintech UI**: Clean, responsive interface inspired by modern investment apps.
- **Admin Dashboard**: Manage families, generate access codes, and export results to CSV.

## Getting Started

### Prerequisites

- Node.js installed.
- A Firebase project (free tier).

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/concept-market.git
   cd concept-market
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Open `services/config.ts`.
   - Ensure your Firebase keys are present (or use environment variables).

4. Run locally:
   ```bash
   npm run dev
   ```

## Deployment

To deploy to the web:

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy to Firebase Hosting (if configured):
   ```bash
   npx firebase deploy
   ```

## Admin Access

- **Login Code**: `ADMIN`
- **Demo Family Code**: `CMC2025`
