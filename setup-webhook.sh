#!/bin/bash

# Webhook server để auto-deploy khi có commit mới
# Sử dụng port 9000 để tránh conflict

echo "🎣 Thiết lập webhook cho auto-deploy..."

# Tạo thư mục webhook
mkdir -p /var/www/webhook

# Tạo script webhook
cat > /var/www/webhook/webhook.js << 'EOF'
const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');

const SECRET = 'hello-vps-webhook-secret'; // Thay đổi secret này
const PORT = 9000;
const PROJECT_PATH = '/var/www/hello-vps';

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8');
  const checksum = Buffer.from(signature, 'utf8');
  return crypto.timingSafeEqual(digest, checksum);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const signature = req.headers['x-hub-signature-256'];
        
        if (!signature || !verifySignature(body, signature, SECRET)) {
          res.writeHead(401);
          res.end('Unauthorized');
          return;
        }

        const payload = JSON.parse(body);
        
        // Chỉ deploy khi push vào main branch
        if (payload.ref === 'refs/heads/main') {
          console.log('🚀 Bắt đầu auto-deploy...');
          
          // Chạy deploy script
          execSync(`cd ${PROJECT_PATH} && ./deploy-vps.sh`, {
            stdio: 'inherit',
            timeout: 300000 // 5 minutes timeout
          });
          
          console.log('✅ Deploy hoàn thành!');
          res.writeHead(200);
          res.end('Deploy successful');
        } else {
          res.writeHead(200);
          res.end('Not main branch, skipping deploy');
        }
      } catch (error) {
        console.error('❌ Deploy failed:', error);
        res.writeHead(500);
        res.end('Deploy failed: ' + error.message);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🎣 Webhook server đang chạy tại port ${PORT}`);
  console.log(`📝 Webhook URL: http://YOUR_VPS_IP:${PORT}/webhook`);
});
EOF

# Tạo systemd service cho webhook
cat > /etc/systemd/system/hello-vps-webhook.service << EOF
[Unit]
Description=Hello VPS Webhook Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/webhook
ExecStart=/usr/bin/node webhook.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Khởi động webhook service
systemctl daemon-reload
systemctl enable hello-vps-webhook
systemctl start hello-vps-webhook

echo "✅ Webhook đã được thiết lập!"
echo "📝 Thêm webhook URL này vào GitHub:"
echo "   http://$(curl -s ifconfig.me):9000/webhook"
echo "🔐 Secret: hello-vps-webhook-secret"
