# start-dev.sh (Unix/Linux/Mac용 개발 서버 시작)
#!/bin/bash

echo "🚀 Starting Node.js Backend Development Server..."
echo ""
echo "📡 Server will run on: http://localhost:8080"
echo "🔍 Health check: http://localhost:8080/health"
echo "📋 API endpoints: http://localhost:8080/api/posts"
echo ""

# 환경 변수 설정
export NODE_ENV=development

# .env 파일이 없으면 생성
if [ ! -f .env ]; then
    echo "📄 Creating .env file from example..."
    cp .env.example .env
fi

# 의존성 설치 (package.json이 변경된 경우)
if [ package.json -nt node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 데이터 디렉토리 생성
mkdir -p data

# 개발 서버 실행
echo "🔧 Starting server with nodemon..."
npm run dev

---

# start-dev.bat (Windows용 개발 서버 시작)
@echo off
echo 🚀 Starting Node.js Backend Development Server...
echo.
echo 📡 Server will run on: http://localhost:8080
echo 🔍 Health check: http://localhost:8080/health
echo 📋 API endpoints: http://localhost:8080/api/posts
echo.

REM 환경 변수 설정
set NODE_ENV=development

REM .env 파일이 없으면 생성
if not exist .env (
    echo 📄 Creating .env file from example...
    copy .env.example .env
)

REM 의존성 설치
echo 📦 Installing dependencies...
npm install

REM 데이터 디렉토리 생성
if not exist data mkdir data

REM 개발 서버 실행
echo 🔧 Starting server with nodemon...
npm run dev

---

# deploy.sh (프로덕션 배포용)
#!/bin/bash

echo "🚀 Deploying Node.js Backend..."
echo ""

# 환경 변수 설정
export NODE_ENV=production

# 의존성 설치
echo "📦 Installing production dependencies..."
npm ci --only=production

# 데이터베이스 초기화
echo "🗄 Initializing database..."
npm run init-db

# PM2로 프로덕션 서버 실행
if command -v pm2 &> /dev/null; then
    echo "🚀 Starting with PM2..."
    pm2 start src/server.js --name "board-api" --env production
    pm2 save
    echo "✅ Server started with PM2"
    echo "📊 Monitor: pm2 monit"
    echo "📋 Logs: pm2 logs board-api"
else
    echo "⚠️  PM2 not found, starting with node..."
    echo "💡 Consider installing PM2: npm install -g pm2"
    npm start
fi

echo ""
echo "✅ Deployment completed!"
echo "📡 Server running on: http://localhost:8080"