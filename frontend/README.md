# Frontend Setup & Run Instructions

## Quick Start

### 1. Install Dependencies
```powershell
cd frontend
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server
```powershell
npm run dev
```

Frontend will start at: **http://localhost:3000**

## Available Scripts

### Development
```powershell
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (dashboard)
│   ├── providers.tsx      # React Query & Auth providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── FilterBar.tsx     # Search & filter
│   ├── TaskCard.tsx      # Task display
│   ├── TaskDashboard.tsx # Main dashboard
│   └── TaskForm.tsx      # Create/Edit modal
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication
└── lib/                  # Utilities
    ├── api.ts           # API client
    └── utils.ts         # Helper functions
```

## Key Features

### Authentication
- JWT-based authentication
- Protected routes
- Auto-redirect to login
- Persistent sessions

### Task Management
- Create, edit, delete tasks
- Real-time updates (React Query)
- Search and filter
- Sort by multiple fields
- Pagination

### UI/UX
- Responsive design
- Toast notifications
- Loading states
- Form validation
- Color-coded priorities
- Due date warnings

## Environment Variables

### Required
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000/api)

## Building for Production

### Create Production Build
```powershell
npm run build
```

### Start Production Server
```powershell
npm run start
```

Production server runs on: **http://localhost:3000**

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Manual Deployment
```powershell
npm run build
npm run start
```

## Troubleshooting

### Module Not Found
```powershell
rm -rf node_modules
rm package-lock.json
npm install
```

### API Connection Issues
- Check backend is running on http://localhost:8000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

### Build Errors
```powershell
npm run lint           # Check for linting errors
rm -rf .next           # Clear Next.js cache
npm run build          # Rebuild
```

## Tech Stack

- **Next.js 14**: React framework with app router
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **React Query**: Data fetching & caching
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **Lucide React**: Icons
- **date-fns**: Date formatting
