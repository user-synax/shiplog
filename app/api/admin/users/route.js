import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";
import { isAdminEmail } from "../../../../lib/utils";
import { checkAndUpdateExpiredPro } from "../../../../lib/server-utils";

export const runtime = "nodejs";

export async function GET(request) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await dbConnect();
  const users = await User.find({}, 'name email username isPro proSubscription createdAt currentStreak totalProjects totalLogs').sort({ createdAt: -1 });
  
  // Check and update expired pro for all users
  const updatedUsers = await Promise.all(users.map(async user => await checkAndUpdateExpiredPro(user)));
  
  return NextResponse.json({ users: updatedUsers });
}

export async function PATCH(request) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await dbConnect();
  const { userId, isPro } = await request.json();
  
  try {
    const updateData = { isPro };
    
    if (isPro) {
      // Admin grants 1 week subscription
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(now.getDate() + 7); // Add 7 days
      
      updateData.proSubscription = {
        grantedBy: "admin",
        grantedAt: now,
        expiresAt: expiresAt
      };
    } else {
      // Remove pro subscription
      updateData.proSubscription = null;
    }
    
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await auth();
  if (!session || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await dbConnect();
  const { userId } = await request.json();
  
  try {
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
