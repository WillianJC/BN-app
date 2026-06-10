FROM oven/bun:1 AS builder
ARG VITE_API_URL
ARG VITE_HTML_LANG
ARG VITE_APP_TITLE
ARG VITE_DEFAULT_PAGE_LIMIT
WORKDIR /app
COPY package.json ./
RUN bun install
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
