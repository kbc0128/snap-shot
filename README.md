# Snapshot - Startup Intelligence

AI-powered startup research and competitive intelligence platform. Uses Claude for web search and Gemini for data validation to provide accurate, cross-referenced startup information.

![Snapshot Screenshot](screenshot.png)

## Features

- **Company Overview**: Funding, stage, employee count, headquarters
- **Market Map**: Visual representation of market segments and competitors
- **Value Chain**: Industry value chain with company positioning
- **Competitor Analysis**: Deep dive into competitor strengths, weaknesses, and differentiators
- **Funding Research**: Detailed funding history, investors, and valuations
- **Team Research**: Executive profiles, backgrounds, and career histories
- **Dual-Model Validation**: Claude searches, Gemini validates, Claude refines

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Claude API** - Primary research with web search
- **Gemini API** - Data validation with Google Search grounding

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/snapshot.git
cd snapshot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude |
| `GEMINI_API_KEY` | Your Google Gemini API key |

## Architecture

```
┌─────────────────┐
│   User Query    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Claude + Web   │  ← Step 1: Initial research
│     Search      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gemini + Google │  ← Step 2: Cross-reference & validate
│     Search      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Claude Refine  │  ← Step 3: Final quality control
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Final Output   │
└─────────────────┘
```

## API Routes

- `POST /api/claude` - Claude API with web search
- `POST /api/gemini` - Gemini API with Google Search grounding

## License

MIT
