# Kas TempMail ⚡️

A modern, colorful, and bold temporary email service. Generate unique email addresses and receive messages in real-time.

## Features
- **Instant Generation**: Get a unique `@kasmail.temp` address in one click.
- **Real-time Inbox**: Messages appear automatically (5s polling).
- **Auto-Cleanup**: All data is stored in memory and wiped after 30 minutes.
- **Bold UI**: "Kas Style" design with vibrant colors and thick borders.
- **Simulation Tool**: Built-in button to test incoming emails.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Motion
- **Backend**: Node.js + Express
- **Icons**: Lucide React
- **Animations**: Motion (formerly Framer Motion)

## Deployment to Vercel

1. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Initialize git in this directory: `git init`.
   - Add files: `git add .`.
   - Commit: `git commit -m "Initial commit"`.
   - Push to your repo.

2. **Deploy on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click "Add New" -> "Project".
   - Import your GitHub repository.
   - Vercel will automatically detect the configuration and deploy.

## Local Development
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints
- `POST /api/generate`: Generates a new temporary email.
- `GET /api/inbox?email=...`: Fetches messages for the given email.
- `POST /api/receive`: Simulates an incoming email (requires `to`, `from`, `subject`, `body`).

---
Built with ❤️ by Kas.
