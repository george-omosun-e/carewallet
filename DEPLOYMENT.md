# 🚀 CareWallet - Quick Deployment Guide

## Step 1: Upload to GitHub

1. Create a new repository on GitHub
2. In your local project folder:

```bash
cd health-wallet
git init
git add .
git commit -m "Initial commit - CareWallet frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_USE_MOCK_API=true
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

6. Click **"Deploy"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd health-wallet
vercel

# Follow the prompts, then:
vercel --prod
```

## Step 3: Configure for Production

Once your backend is deployed:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Update:
   ```
   NEXT_PUBLIC_USE_MOCK_API=false
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   ```
4. Redeploy (Vercel will auto-redeploy on config change)

## Switching to Real Backend

When your backend is ready, just update environment variables:
1. Set `NEXT_PUBLIC_USE_MOCK_API=false`
2. Set `NEXT_PUBLIC_API_URL=https://your-api.com`
3. The app will automatically use real API calls

## Troubleshooting

### Build fails
- Check Node version (needs 18+)
- Run `npm install` again

### API calls failing
- Check `.env.local` configuration
- Verify `NEXT_PUBLIC_USE_MOCK_API` is set correctly

---

Made with ❤️ for healthcare accessibility
