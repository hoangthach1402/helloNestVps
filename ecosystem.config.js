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
      repo: 'git@github.com:hoangthach1402/helloNestVps.git',
      path: '/root/hello-vps',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};