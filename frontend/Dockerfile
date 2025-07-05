# Step 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy full source code before build
COPY . .

RUN npm install
RUN npm run build   


# Step 2: Serve the built app with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
