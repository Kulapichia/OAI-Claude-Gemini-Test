# -------- Stage 1: Build --------
FROM node:20-alpine AS build
WORKDIR /app
# 更好利用构建缓存
COPY package*.json ./
RUN npm ci
# 复制源码并构建
COPY . .
RUN npm run build

# -------- Stage 2: 静态文件输出 --------
FROM alpine:latest
RUN apk add --no-cache ca-certificates python3
WORKDIR /app
# 只复制构建产物
COPY --from=build /app/build ./build

# 启用简单的文件服务器，方便访问和复制文件
EXPOSE 8080
CMD ["python3", "-m", "http.server", "8080", "--directory", "/app/build"]