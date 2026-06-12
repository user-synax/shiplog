import dbConnect from "./db";
import User from "@/models/User";

export async function checkAndUpdateExpiredPro(user) {
  if (!user.isPro) return user;
  
  // Check if it's an admin grant with an expiration date
  if (user.proSubscription?.grantedBy === "admin" && user.proSubscription.expiresAt) {
    const now = new Date();
    const expiresAt = new Date(user.proSubscription.expiresAt);
    if (now > expiresAt) {
      // Expired! Update user
      await dbConnect();
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { isPro: false, proSubscription: null },
        { new: true }
      );
      return updatedUser;
    }
  }
  
  return user;
}
