# Jailbreak Detector — Frontend

ChatGPT-style web UI for the jailbreak-prompt detection model (TF-IDF + Logistic Regression, 97.7% accuracy).

## Stack
- Next.js 15 (App Router) + React 19
- Corvix design theme (pure black, white accents, Outfit/Rubik fonts)
- Deployed on Vercel; backend served via nginx reverse proxy on the VPS

## Run locally
```bash
npm install
npm run dev
```

## API
The frontend calls `NEXT_PUBLIC_API_URL` (default `https://srv1869613.hstgr.cloud:8443`) → `/api/predict`.

POST `/api/predict` `{"prompt": "..."}` →
```json
{
  "label": "jailbreak" | "benign",
  "confidence": 0.78,
  "probabilities": { "benign": 0.22, "jailbreak": 0.78 }
}
```