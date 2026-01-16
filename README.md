# CareWallet - Digital Health Wallet Frontend

A beautiful, professional frontend for the CareWallet platform - enabling families to collectively fund healthcare expenses with transparency and accountability.

## Features

- 🎨 **Beautiful UI**: Warm, caring design with teal and coral color scheme
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- ⚡ **Fast**: Built with Next.js 14 for optimal performance
- 🔄 **Mock API Ready**: Pre-configured with mock data, easily switch to real backend
- 🎯 **Type-Safe**: Full TypeScript support
- 🎭 **Animations**: Smooth, delightful micro-interactions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd health-wallet
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Use mock API (set to false when backend is ready)
NEXT_PUBLIC_USE_MOCK_API=true

# Backend API URL (update when backend is deployed)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Paystack Public Key (for payment integration)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_key_here
```

## Switching from Mock to Real Backend

When your backend is ready:

1. Update `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

2. That's it! The app will automatically use the real API.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy
```bash
vercel
```

3. Follow the prompts

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables in Vercel dashboard
6. Deploy!

### Environment Variables on Vercel

Add these in your Vercel project settings:

- `NEXT_PUBLIC_USE_MOCK_API` - Set to `true` for demo, `false` for production
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Your Paystack public key

## Project Structure

```
health-wallet/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and wallet management
│   ├── wallet/            # Public wallet pages
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components
├── lib/
│   ├── api/               # API client and mock data
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## API Integration Guide

The API client (`lib/api/client.ts`) automatically switches between mock and real API based on environment variables.

### Backend Endpoints Required

```typescript
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
GET    /auth/me

GET    /wallets
GET    /wallets/:id
GET    /wallets/code/:code
POST   /wallets
PUT    /wallets/:id
DELETE /wallets/:id

GET    /wallets/:walletId/transactions
POST   /wallets/:walletId/deposit
POST   /withdrawals

POST   /otp/send
POST   /otp/verify
```

All endpoints should return JSON and follow standard REST conventions.

## Key Pages

- `/` - Landing page
- `/auth/signup` - User registration
- `/auth/login` - User login
- `/dashboard` - User dashboard with wallet list
- `/dashboard/create` - Create new wallet
- `/dashboard/wallet/:id` - Wallet detail page
- `/wallet/:code` - Public wallet page (for contributions)

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Zustand** - State management (if needed)

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

## License

Proprietary - All rights reserved
