# Edge AI Website

The public website for [Edge AI](https://www.edge-ai.space) — AI agents that run locally on your hardware.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Framer Motion** (scroll animations)
- **Lucide React** (icons)
- **Claude API** (chatbot assistant)

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployed via Railway with Docker. Set `ANTHROPIC_API_KEY` as an environment variable for the chat assistant.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Enables the chat assistant (Claude Haiku) |
| `PORT` | Auto | Set by Railway |
