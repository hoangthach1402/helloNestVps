# GitHub Actions Deployment Guide

## 🚀 Automated Deployment Setup

Dự án này sử dụng GitHub Actions để tự động deploy lên VPS mỗi khi có code mới được push lên branch `main`.

## 📋 Prerequisites

1. **VPS đã setup:**
   - Node.js và npm đã cài đặt
   - PM2 đã cài đặt globally: `npm install -g pm2`
   - Git đã cài đặt
   - Project đã clone tại `/var/www/hello-vps`

2. **GitHub Secrets đã config:**
   - `VPS_HOST`: IP address hoặc domain của VPS
   - `VPS_USERNAME`: Username để SSH
   - `VPS_PASSWORD`: Password để SSH
   - `VPS_PORT`: SSH port (mặc định 22)

## ⚙️ Setup GitHub Secrets

1. Vào GitHub repository → Settings → Secrets and variables → Actions
2. Thêm các secrets sau:

```
VPS_HOST = 207.180.251.81
VPS_USERNAME = root
VPS_PASSWORD = your-password
VPS_PORT = 22
```

## 📁 Workflows

### 1. `deploy.yml` - Simple Deploy
- Trigger: Push to `main` branch
- Actions: Pull code, build, restart PM2
- Supports: Both Docker and PM2

### 2. `ci-cd.yml` - Full CI/CD Pipeline
- Trigger: Push to `main`/`develop`, Pull Requests
- Actions: 
  - Test trên multiple Node versions (18.x, 20.x)
  - Run linter và tests
  - Deploy nếu tests pass (chỉ main branch)

## 🔄 Deployment Process

1. **Developer push code:**
   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```

2. **GitHub Actions tự động:**
   - Checkout code
   - SSH vào VPS
   - Pull latest code
   - Install dependencies
   - Build application
   - Restart PM2
   - Health check

3. **Monitoring:**
   - Check GitHub Actions tab để xem deployment status
   - Logs sẽ hiển thị chi tiết quá trình deploy

## 🐛 Troubleshooting

### Common Issues:

1. **SSH Connection Failed:**
   ```
   Error: ssh: connect to host failed
   ```
   - Check VPS_HOST, VPS_USERNAME, VPS_PASSWORD secrets
   - Verify SSH access manually

2. **PM2 App Not Found:**
   ```
   Error: [PM2] Process hello-vps not found
   ```
   - Workflow sẽ tự động start app nếu không tồn tại

3. **Build Failed:**
   ```
   Error: npm run build failed
   ```
   - Check TypeScript errors
   - Verify dependencies

### Manual Deploy:
```bash
# Nếu GitHub Actions fails, có thể deploy manual:
ssh root@207.180.251.81
cd /var/www/hello-vps
git pull origin main
npm install
npm run build
pm2 restart hello-vps
```

## 📊 Health Checks

Workflow include health check tự động:
- Verify PM2 process running
- Show logs nếu deployment fails
- Exit với error code nếu không thành công

## 🔧 Advanced Configuration

### Custom Deploy Script:
Có thể tạo `scripts/deploy.sh` cho custom logic:

```bash
#!/bin/bash
# scripts/deploy.sh
echo "Custom deployment logic..."
# Add your custom steps here
```

### Environment Variables:
Add vào workflow nếu cần:

```yaml
env:
  NODE_ENV: production
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## 🎯 Next Steps

1. ✅ Setup GitHub Secrets
2. ✅ Push code to test deployment
3. ✅ Monitor first deployment
4. ✅ Setup notifications (optional)

Sau khi setup xong, mỗi lần push code sẽ tự động deploy!
