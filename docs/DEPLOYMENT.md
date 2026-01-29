# Deployment (General)

This project is a Node.js (Express) REST API. Vercel-specific files were removed because the project will use traditional deployment options.

Recommended deployment options:

- Docker (recommended)
  - Build image: `docker build -t myapp:latest .`
  - Run container: `docker run -e PORT=3000 -p 3000:3000 myapp:latest`
  - Use `docker-compose.yml` for multi-service setups (DB, redis, etc.).

- Process manager (PM2)
  - Install PM2 on server: `npm i -g pm2`
  - Start app: `pm2 start npm --name myapp -- start`
  - Use `pm2 save` and `pm2 startup` to persist across reboots.

- systemd (Linux)
  - Create a `myapp.service` that runs `npm start` from app root; use `Restart=always`.

- PaaS (Heroku / Render / Railway)
  - Provide `PORT` as env var and deploy via git; set build/start commands in service settings.

Local development:
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Start production mode: `npm start`

Environment variables
- Keep secrets out of the repo; use `.env` locally and environment variables in production.

Notes
- If you want a serverless approach later, we can add a separate serverless entrypoint and CI config.
- For container deployments, consider adding `Dockerfile` and `docker-compose.yml` (I can add these if you want).
