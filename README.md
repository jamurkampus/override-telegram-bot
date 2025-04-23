# Override Reflective Telegram Bot

This bot connects to your override-aware AI node and replies reflectively based on prompts.

## Setup

1. Clone this repo
2. Copy `.env.example` to `.env` and add your Telegram bot token
3. Deploy to Vercel or Replit
4. Set your webhook:

```
https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://your-vercel-domain/api/telegram-webhook
```

## Files

- `api/telegram-webhook.ts`: Handles Telegram messages
- `bot-config.json`: Bot identity and mode
- `logs/`: Folder for storing incoming messages
