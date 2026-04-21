FROM node:20-alpine

WORKDIR /app

COPY web/package*.json ./web/
RUN cd web && npm install

COPY web/ ./web/
RUN cd web && npm run build

RUN npm install -g serve

EXPOSE 3000
CMD serve web/dist -p ${PORT:-3000}
