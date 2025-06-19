# SSH Key Setup Guide for GitHub Actions

## Issue
GitHub Actions is failing to authenticate with the VPS using SSH key. Error message:
```
ssh: no key found
ssh: unable to authenticate, attempted methods [none], no supported methods remain
```

## Solution Steps

### 1. Generate SSH Key Pair (if not already done)
On your VPS (207.180.251.81), run:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@hello-vps"
```
- Press Enter for default location (~/.ssh/id_rsa)
- Press Enter twice for no passphrase

### 2. Add Public Key to VPS
```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. Get Private Key Content
```bash
cat ~/.ssh/id_rsa
```
Copy the ENTIRE content including:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- All the content in between
- `-----END OPENSSH PRIVATE KEY-----`

### 4. Add Secret to GitHub Repository
1. Go to your GitHub repository: https://github.com/hoangthach1402/helloNestVps
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `VPSKEY`
5. Value: Paste the ENTIRE private key content from step 3
6. Click "Add secret"

### 5. Test SSH Connection Locally
Test the SSH key works:
```bash
ssh -i ~/.ssh/id_rsa root@207.180.251.81
```

### 6. Alternative: Use Password Authentication (Less Secure)
If SSH key continues to fail, you can temporarily use password:

Update `.github/workflows/deploy.yml`:
```yaml
- name: Deploy to VPS
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: 207.180.251.81
    username: root
    password: ${{ secrets.VPS_PASSWORD }}
    port: 22
    script: |
      # deployment script...
```

Then add `VPS_PASSWORD` secret to GitHub with your VPS root password.

### 7. Verify GitHub Actions Secrets
Ensure the secret exists:
1. Go to repository Settings → Secrets and variables → Actions
2. Verify `VPSKEY` is listed
3. If not present, add it following step 4

### 8. Common SSH Key Issues
- **Wrong format**: Ensure you copied the OPENSSH format, not PuTTY format
- **Extra characters**: No extra spaces or characters before/after the key
- **Wrong key**: Ensure you copied the PRIVATE key (id_rsa), not public key (id_rsa.pub)
- **Passphrase**: If your key has a passphrase, add it as `passphrase` parameter in the workflow

## Next Steps
1. Verify/recreate the SSH key following steps 1-3
2. Update the GitHub secret following step 4
3. Push a new commit to trigger the deployment
4. Monitor the GitHub Actions log for success

If issues persist, we can switch to password authentication temporarily or debug the SSH configuration further.
