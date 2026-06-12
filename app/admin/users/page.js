export const runtime = "nodejs";

import { auth } from "../../../auth.js";
import dbConnect from "../../../lib/db.js";
import User from "../../../models/User.js";
import { isAdminEmail } from "../../../lib/utils.js";
import UsersClient from "./UsersClient.jsx";

export default async function UsersPage() {
  await dbConnect();
  const users = await User.find({}, 'name email username isPro proSubscription createdAt currentStreak totalProjects totalLogs').sort({ createdAt: -1 });
  
  // Convert to plain objects
  const plainUsers = users.map(user => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    isPro: user.isPro,
    proSubscription: user.proSubscription ? {
      grantedBy: user.proSubscription.grantedBy,
      grantedAt: user.proSubscription.grantedAt?.toISOString(),
      expiresAt: user.proSubscription.expiresAt?.toISOString(),
    } : null,
    createdAt: user.createdAt.toISOString(),
    currentStreak: user.currentStreak,
    totalProjects: user.totalProjects,
    totalLogs: user.totalLogs
  }));
  
  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--color-ink)" }}
      >
        Manage Users
      </h1>
      <UsersClient initialUsers={plainUsers} />
    </div>
  );
}
