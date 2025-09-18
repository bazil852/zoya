# RentHub - Peer-to-Peer Rental Marketplace

A modern, mobile-first rental marketplace web application built with React, Vite, TailwindCSS, and Supabase.

## 🚀 Features

### Core Functionality
- **User Authentication**: Email/password and Google OAuth signup/signin
- **Listing Management**: Create, edit, delete rental listings with image uploads
- **Search & Discovery**: Advanced filtering by category, price, location
- **Booking System**: Request rentals, accept/reject booking requests
- **Real-time Messaging**: Chat between renters and owners
- **Review System**: Rate and review users after completed rentals
- **Profile Management**: User profiles with ratings and statistics

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly navigation with bottom navigation bar
- Swipe-friendly image galleries
- Mobile-optimized forms and interactions

### Real-time Features
- Live messaging with Supabase Realtime
- Instant booking status updates
- Real-time notification system

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Routing**: React Router
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier available)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd rental-marketplace
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API to get your URL and keys
3. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
4. Update `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Copy and run the entire `database-schema.sql` file
3. This will create all tables, indexes, RLS policies, and triggers

### 4. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create two buckets:
   - `listings` (for listing images)
   - `profiles` (for profile pictures)
3. Make both buckets public by updating their policies

### 5. Authentication Setup

1. Go to Authentication → Settings in Supabase
2. Configure redirect URLs:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/**`
3. Enable Google OAuth (optional):
   - Go to Authentication → Providers
   - Enable Google and add your OAuth credentials

### 6. Run the Application
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation
│   └── ListingCard.jsx # Listing display component
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   └── supabaseClient.js # Supabase configuration
├── pages/              # Page components
│   ├── Home.jsx        # Main explore/search page
│   ├── Auth.jsx        # Login/signup page
│   ├── ListingDetail.jsx # Individual listing view
│   ├── CreateListing.jsx # Create/edit listing form
│   ├── Bookings.jsx    # Booking management
│   ├── Messages.jsx    # Real-time messaging
│   └── Profile.jsx     # User profile and settings
└── utils/              # Utility functions
```

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User profiles (extends Supabase auth)
- **listings**: Rental item listings
- **bookings**: Rental booking requests and status
- **messages**: Chat messages between users
- **reviews**: User ratings and reviews

All tables include Row Level Security (RLS) policies for data protection.

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- User authentication required for sensitive operations
- Secure file uploads with Supabase Storage
- Input validation and sanitization
- Protected API routes

## 📱 Mobile Features

- Bottom navigation for easy thumb access
- Touch-optimized image carousels
- Responsive grid layouts
- Mobile-first form designs
- Swipe gestures for navigation

## 🔄 Real-time Features

- Live chat messaging
- Booking status updates
- Real-time notifications
- Automatic UI updates on data changes

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables
4. Set up redirect rules for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Supabase Connection Error**
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure RLS policies are properly configured

**Image Upload Issues**
- Verify storage buckets are created and public
- Check file size limits (default 50MB in Supabase)
- Ensure proper CORS configuration

**Real-time Not Working**
- Verify Supabase Realtime is enabled
- Check that RLS policies allow reads
- Ensure proper subscription setup

**Authentication Issues**
- Check redirect URLs in Supabase settings
- Verify OAuth providers are properly configured
- Ensure email confirmation is set up correctly

## 📞 Support

For support and questions:
- Check the troubleshooting section above
- Review Supabase documentation
- Open an issue in the repository

---

Built with ❤️ using React, Vite, TailwindCSS, and Supabase# zoya
