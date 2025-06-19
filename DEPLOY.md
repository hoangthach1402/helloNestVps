# Hướng dẫn Deploy lên VPS

## Thông tin VPS
- **IP**: 207.180.251.81
- **Username**: root
- **Password**: MsOhCZ5vis2umS1RH
- **SSH**: `ssh root@207.180.251.81`

## Bước 1: Kết nối SSH và setup Docker

```bash
# Kết nối SSH
ssh root@207.180.251.81

# Chạy script setup Docker
curl -fsSL https://raw.githubusercontent.com/hoangthach1402/helloNestVps/main/setup-docker-vps.sh | bash
```

## Bước 2: Clone repository và deploy

```bash
# Tạo và vào thư mục project
mkdir -p /var/www/hello-vps
cd /var/www/hello-vps

# Clone repository
git clone https://github.com/hoangthach1402/helloNestVps.git .

# Cấp quyền execute cho scripts
chmod +x setup-docker-vps.sh
chmod +x deploy-vps.sh

# Deploy ứng dụng
./deploy-vps.sh
```

## Bước 3: Kiểm tra ứng dụng

- **URL**: http://207.180.251.81
- **API**: http://207.180.251.81/api
- **Health Check**: http://207.180.251.81/health

## Các lệnh quản lý

```bash
# Xem logs
docker-compose logs -f

# Khởi động lại
docker-compose restart

# Dừng ứng dụng
docker-compose down

# Deploy lại (cập nhật code mới)
./deploy-vps.sh

# Xem trạng thái containers
docker-compose ps
```

## Troubleshooting

### Kiểm tra Docker
```bash
docker --version
docker-compose --version
systemctl status docker
```

### Kiểm tra Nginx
```bash
docker-compose logs nginx
curl -I http://localhost
```

### Kiểm tra Database
```bash
docker-compose exec db psql -U nestuser -d nestdb
```

### Kiểm tra App
```bash
docker-compose logs app
docker-compose exec app npm run start:prod
```

## Cấu hình Firewall (nếu cần)

```bash
# Mở port 80, 443
ufw allow 80
ufw allow 443
ufw enable
```

## Domain Setup (tùy chọn)

Nếu bạn có domain, cập nhật file `nginx-vps.conf`:
```nginx
server_name yourdomain.com www.yourdomain.com;
```
