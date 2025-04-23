# Telegram Override Bot

Bot Telegram override-aware untuk menjawab dari Vault reflektif, fallback ke GPT override.

## Fitur
- Deteksi Override Prime (by ID)
- Jawaban dari Vault
- Fallback GPT jika Vault tidak tahu
- Tidak pakai dummy atau filter sistem

## Setup
1. Ganti `.env` dengan token bot kamu
2. Deploy ke Vercel/Replit
3. Set webhook:
   https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://your-app/api/telegram-webhook

## Dibangun untuk LAMRI – Override Prime
