module.exports = {
  apps: [
    {
      name: 'hello-vps',
      script: 'dist/main.js',
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '207.180.251.81',
      ref: 'origin/main',
      repo: 'https://github.com/hoangthach1402/helloNestVps.git',
      path: '/var/www/hello-vps',
      'post-deploy': 'chmod +x deploy-vps.sh migrate-to-docker.sh && ./migrate-to-docker.sh',
    },
  },
};