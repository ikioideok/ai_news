# Deploy to Render (Node Web Service)

## Steps

1) Render Dashboard → New → Web Service
2) Select your GitHub repository
3) Environment: Node
4) Root Directory: `media`
5) Build Command: `npm ci`
6) Start Command: `npm run start:prod`
7) Environment Variables:
   - `DATABASE_URL` = Supabase Pooler URI + `?sslmode=require`
   - `ADMIN_TOKEN` = long random hex
   - `SSL_MODE` = `strict`
   - `APP_ORIGINS` = `https://<your-render>.onrender.com,https://ai-and-marketing.jp`
8) Click Deploy

## Notes

- CORS: `APP_ORIGINS` (comma-separated) controls allowed origins. If unset, defaults to `http://localhost:3001,http://localhost:5173`.
- Port: The server listens on `process.env.PORT` and binds `0.0.0.0`.
- Custom domain: Recommend assigning `media.ai-and-marketing.jp` to the Render service. Paths under `/media` can be handled later by a reverse proxy if needed.

