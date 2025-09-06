# Node.js 18 Alpine 이미지 사용
FROM node:18-alpine

# 메타데이터 추가
LABEL maintainer="React Board Tutorial"
LABEL description="Node.js Backend for React Board App with File Database"
LABEL version="1.0.0"

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# Node.js 의존성 설치 (SQLite 의존성 제거됨)
RUN npm ci --only=production

# 소스 코드 복사
COPY src/ ./src/
COPY .env.example ./.env

# 데이터 디렉토리 생성
RUN mkdir -p data

# 비root 사용자 생성 및 권한 설정
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# 포트 노출
EXPOSE 8080

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 애플리케이션 실행
CMD ["npm", "start"]