# Hướng dẫn chuyển đổi từ PM2 sang Docker

## 1. SSH vào VPS và chuyển sang Docker

```bash
# SSH vào VPS
ssh root@207.180.251.81

# Điều hướng đến thư mục project
cd /var/www/hello-vps  # hoặc /root/hello-vps nếu đang ở đó

# Pull code mới nhất
git pull origin main

# Cấp quyền execute cho scripts
chmod +x migrate-to-docker.sh deploy-vps.sh setup-webhook.sh check-status.sh

# Chuyển từ PM2 sang Docker
./migrate-to-docker.sh
```

## 2. Thiết lập Auto-Deploy với Webhook

```bash
# Thiết lập webhook
./setup-webhook.sh

# Mở port 9000 cho webhook (nếu có firewall)
ufw allow 9000
```

### Thêm webhook vào GitHub:
1. Vào repository: https://github.com/hoangthach1402/helloNestVps
2. Settings → Webhooks → Add webhook
3. **Payload URL**: `http://207.180.251.81:9000/webhook`
4. **Content type**: `application/json`
5. **Secret**: `hello-vps-webhook-secret`
6. **Events**: Chọn "Just the push event"

## 3. Sử dụng PM2 Deploy (Alternative)

```bash
# Từ máy local, deploy lên VPS
pm2 deploy ecosystem.config.js production

# Hoặc nếu đã có setup
pm2 deploy ecosystem.config.js production --force
```

## 4. Các lệnh quản lý

```bash
# Kiểm tra trạng thái
./check-status.sh

# Deploy thủ công
./deploy-vps.sh

# Xem logs
docker-compose logs -f

# Khởi động lại
docker-compose restart

# Dừng ứng dụng
docker-compose down

# Xem trạng thái containers
docker-compose ps

# Xem webhook logs
systemctl status hello-vps-webhook
journalctl -u hello-vps-webhook -f
```

## 5. Testing

```bash
# Test ứng dụng
curl http://207.180.251.81
curl http://207.180.251.81/api
curl http://207.180.251.81/health

# Test webhook (từ local)
curl -X POST http://207.180.251.81:9000/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main"}'
```

## 6. Troubleshooting

### Nếu port 3000 bị conflict:
```bash
sudo fuser -k 3000/tcp
pm2 stop all
pm2 delete all
```

### Nếu Docker build fail:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

### Xem logs chi tiết:
```bash
docker-compose logs app
docker-compose logs db
docker-compose logs nginx
```
