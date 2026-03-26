# TUKE Canteen Proxy

CORS proxy server for the TUKE canteen web app. Forwards requests to `jedalen.tuke.sk` and adds CORS headers so the browser-based app can fetch menu data.

## Local development

```bash
cd proxy
npm install
npm start
```

The server starts on port 3001 (or `PORT` env var). Test it:

```
http://localhost:3001/menu/studentsky-domov/2025-03-27
http://localhost:3001/health
```

## Deploy to Render.com

1. Push this repo to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com) and click **New > Web Service**.
3. Connect your GitHub repo.
4. Configure the service:
   - **Name**: `tuke-canteen-proxy`
   - **Root Directory**: `proxy`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Add environment variables:
   - `ALLOWED_ORIGINS` — comma-separated list of allowed origins, e.g. `https://your-app.web.app,http://localhost:8081`
6. Click **Deploy**.

After deployment, copy the service URL (e.g. `https://tuke-canteen-proxy.onrender.com`) and set it as `WEB_PROXY_BASE_URL` in `src/services/menuClient.ts`.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `ALLOWED_ORIGINS` | `http://localhost:8081,http://localhost:19006` | Comma-separated allowed CORS origins |
