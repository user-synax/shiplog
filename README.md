<div align="center">
  <img src="https://github.com/user-synax/shiplog/blob/main/public/shiplog.png" alt="Shiplog Logo" width="120" height="120" />
  <h1 align="center">Shiplog</h1>
  <p align="center">
    Your developer identity. One living profile.
  </p>
  <p align="center">
    Showcase projects, track daily build logs, and maintain a streak — all in one beautiful public profile.
  </p>
</div>

<br />

## ✨ Features

### 🎯 Core Features

- **🚀 **Daily Build Logs**: Track your progress, share wins, and document what you're working on
- **🔥 **Streaks**: Build daily and stay consistent with your streak
- **💼 **Projects**: Showcase your best work with pins, tech stacks, and links
- **📊 **Activity Heatmap**: Visualize your coding activity over time
- **🎨 **Beautiful Public Profiles**: A living portfolio that updates with every log
- **🎯 **Goals**: Set and track your learning goals
- **🏆 **Achievements**: Unlock badges as you hit milestones
- **🔧 **Tech Stack Management**: Manage your tech stack and showcase your skills

### 💎 Pro Features

- **📈 **Analytics**: Track profile views and project clicks
- **🌐 **Custom Domains**: Use your own domain for your profile
- **📥 **Priority Support**: Get help faster
- **🎯 **Unlimited Projects**: Showcase all your work

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/user-synax/shiplog
cd shiplog
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory and add the following:

```env
# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shiplog

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📄 License

MIT © [User Synax]
