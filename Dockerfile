FROM node:18-alpine AS builder
WORKDIR /app

# 1. 패키지 메타파일 먼저 복사하여 캐시 활용
COPY package.json package-lock.json ./
RUN npm install

# 2. 이후에 전체 소스 복사
COPY . .
RUN npx svelte-kit sync
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY package.json ./

ENV PORT 3000
EXPOSE 3000
CMD ["node", "build/index.js"]
