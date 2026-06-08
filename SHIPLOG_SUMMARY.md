# Shiplog — Codebase Summary

## Overview

**Shiplog** is a Next.js developer identity platform where developers create professional profiles, log daily builds, showcase projects, track coding streaks, and engage with a gamified achievement system. It combines a portfolio builder with a personal analytics dashboard.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.2.7 (App Router) |
| **Language** | JavaScript (JSX) |
| **Styling** | Tailwind CSS v4 + CSS custom properties |
| **Database** | MongoDB + Mongoose 9 |
| **Auth** | NextAuth v5 (Google OAuth + Credentials) |
| **UI** | shadcn/ui (new-york), Radix UI, Lucide React, Framer Motion |
| **Charts** | Recharts |
| **State** | Zustand |
| **Media** | Cloudinary (image upload) |
| **Payments** | Razorpay (subscriptions) |
| **Fonts** | Inter (body), Plus Jakarta Sans (headings) |
| **Package Manager** | pnpm |

---

## Project Structure

```
shiplog/
├── app/                    # Next.js App Router (pages + API)
│   ├── [username]/         # Dynamic public profile pages
│   ├── admin/              # Admin panel
│   ├── api/                # ~30 REST API routes
│   ├── auth/               # Sign in / Sign up
│   ├── dashboard/          # Protected user dashboard
│   ├── onboarding/         # New user onboarding flow
│   ├── promo/              # Promo code management
│   ├── layout.js           # Root layout (SessionProvider + fonts)
│   ├── page.js             # Landing page
│   └── globals.css         # Global styles + CSS variables
├── components/
│   ├── ui/                 # shadcn/ui components (tooltip, WaveBackground)
│   ├── aura/               # Hero button styles
│   └── ThemeProvider.jsx   # Dynamic CSS variable theming
├── lib/                    # Shared utilities
│   ├── auth.js             # Server session helper
│   ├── utils.js            # cn(), isAdminEmail(), getDefaultAvatarUrl()
│   ├── constants.js        # Pricing plans
│   ├── themes.js           # 8 profile themes (4 free, 4 Pro)
│   ├── db.js               # Cached Mongoose connection
│   ├── cloudinary.js       # Cloudinary config
│   ├── promo.js            # Promo code validation/application
│   └── achievements.js     # Achievement definitions & unlock logic
├── models/                 # 12 Mongoose models
├── stores/                 # Zustand stores (logs, projects)
├── middleware.js            # Route protection (/dashboard, /admin)
├── auth.js                 # NextAuth configuration
└── DESIGN.md               # Full design system specification
```

---

## Database Models (12)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Core user profile | email, username, password, socials, streak data, theme, availability |
| **BuildLog** | Daily build entry (500 chars) | content, tags, mood (5 options) |
| **Project** | Portfolio project | title, description, coverImage, techStack, demoUrl, repoUrl, status, isPinned |
| **Goal** | User goals/tasks | title, isCompleted, targetDate, order |
| **Learning** | Learning resources | title, url, order |
| **TechStack** | Technology entries | name, category (lang/framework/db/tool/other), order |
| **Achievement** | Gamified badges | type, title, earnedAt |
| **Guestbook** | Profile visitor messages | authorName, authorEmail, message, isApproved |
| **ProfileView** | Profile visit analytics | visitorIp, country, city, referrer, userAgent |
| **Click** | Project link clicks | type (demo/repo), visitorIp |
| **Subscription** | Razorpay payments | plan, razorpayOrderId, startDate, endDate, status |
| **PromoCode** | Discount codes | code, plan, discountType, discountValue, maxUses |

---

## Pages & Routes

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, pricing |
| `/auth/signin` | Sign in (email/password or Google) |
| `/auth/signup` | Sign up |
| `/[username]` | Public profile (avatar, bio, projects, logs, streak, guestbook) |
| `/[username]/achievements` | User achievements display |
| `/[username]/analytics` | Public profile analytics |
| `/[username]/logs` | Public build logs feed |
| `/[username]/projects` | Public projects showcase |
| `/[username]/stack` | Public tech stack display |

### Protected Pages (`/dashboard/*`)
| Route | Description |
|-------|-------------|
| `/dashboard` | Dashboard home |
| `/dashboard/analytics` | Build log & profile analytics |
| `/dashboard/billing` | Subscription plans & pricing |
| `/dashboard/logs` | Manage build logs (CRUD) |
| `/dashboard/projects` | Manage projects |
| `/dashboard/settings` | Profile settings (theme, socials, bio) |
| `/dashboard/stack` | Manage tech stack |

### Admin & Misc
| Route | Description |
|-------|-------------|
| `/admin` | Admin panel |
| `/onboarding` | New user onboarding form |
| `/promo` | Promo code management |

---

## API Endpoints (~30)

| Category | Endpoints |
|----------|-----------|
| **Auth** | `api/auth/[...nextauth]`, `api/auth/signup` |
| **User** | `api/user/me`, `api/user/update`, `api/user/setup`, `api/user/avatar`, `api/user/resume` |
| **Projects** | `api/projects`, `api/projects/[id]`, `api/projects/[id]/pin`, `api/projects/cover`, `api/projects/reorder` |
| **Logs** | `api/logs`, `api/logs/[id]` |
| **Stack** | `api/stack`, `api/stack/reorder` |
| **Goals** | `api/goals`, `api/goals/reorder` |
| **Learning** | `api/learning` |
| **Analytics** | `api/analytics`, `api/profile-view`, `api/project-click`, `api/public/heatmap` |
| **Guestbook** | `api/guestbook` |
| **Billing** | `api/billing/apply-promo` |
| **Promo** | `api/promo/validate`, `api/admin/promo` |
| **Admin** | `api/admin/promo`, `api/admin/stats` |
| **Username** | `api/username/check` |

---

## Key Architecture Decisions

1. **Dark-mode only** — No light mode; CSS variables power 8 themes (Default, Sunset, Forest, Cosmic, Ocean, Neon, Sunrise, Midnight). 4 themes require Pro subscription.

2. **Streak system** — Gamifies daily build logging. User model tracks `currentStreak`, `longestStreak`, `lastLogDate`, and `totalLogs`. Achievements auto-unlock at streak milestones.

3. **Analytics tracking** — Profile views (with geo IP) and project link clicks are stored separately, enabling per-profile analytics dashboards.

4. **Zustand over Redux** — Lightweight client-side state for logs and projects with CRUD + reorder + pin functionality.

5. **NextAuth v5 beta** — JWT-based sessions with custom callbacks that enrich tokens with MongoDB user data (`id`, `username`, `isAdmin`).

6. **Promo code system** — Admin-created discount codes with percent/fixed discounts, plan targeting, usage limits, and expiry.

---

## Environment Variables

```
NEXTAUTH_SECRET          # NextAuth encryption secret
NEXTAUTH_URL             # App base URL
GOOGLE_CLIENT_ID         # Google OAuth client ID
GOOGLE_CLIENT_SECRET     # Google OAuth client secret
MONGODB_URI              # MongoDB connection string
CLOUDINARY_CLOUD_NAME    # Cloudinary config
CLOUDINARY_API_KEY       # Cloudinary config
CLOUDINARY_API_SECRET    # Cloudinary config
ADMIN_EMAILS             # Comma-separated admin emails
```
