# VideoChat AI

AI-powered video transcription and completion system.

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript
- **Backend**: NestJS, Prisma ORM
- **AI**: OpenAI GPT for transcription and completion

## Project Structure

```
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── videos/         # Video management
│   │   ├── transcription/  # Transcription service
│   │   ├── ai-completion/  # AI completion service
│   │   ├── prompts/        # Prompt templates
│   │   └── prisma/         # Database connection
│   └── prisma/
│       └── schema.prisma   # Database schema
├── frontend/               # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   └── lib/                # Utilities and API
└── SKILLS.md              # Development guidelines
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend** (`.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/videochat
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Features

- Upload audio/video files
- AI-powered transcription
- Generate AI completions from transcriptions
- User authentication
- Responsive design

## Development

See [SKILLS.md](./SKILLS.md) for development guidelines and conventions.
