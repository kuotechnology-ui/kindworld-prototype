FROM node:20-alpine AS builder

WORKDIR /app

COPY web/package*.json ./web/
RUN cd web && npm install

COPY web/ ./web/
RUN cd web && npm run build

# ── Production: nginx static server ──────────────────────────────────────────
FROM nginx:1.25-alpine

COPY --from=builder /app/web/dist /usr/share/nginx/html

# SPA routing: all unknown paths fall back to index.html
# PORT is injected by Railway; envsubst replaces $PORT at container start
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
