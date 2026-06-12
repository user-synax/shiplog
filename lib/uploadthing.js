import { createUploadthing } from "uploadthing/next";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  resumeUploader: f({
    "application/pdf": { maxFileSize: "5MB", maxFileCount: 1 },
    "application/msword": { maxFileSize: "5MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "5MB", maxFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");

      await dbConnect();
      const user = await User.findOne({ email: session.user.email });
      if (!user) throw new Error("User not found");

      // Return userId to be available in onUploadComplete
      return { userId: user._id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      await dbConnect();
      await User.findByIdAndUpdate(metadata.userId, { resumeUrl: file.url });

      return { uploadedBy: metadata.userId, url: file.url };
    }),
  // Avatar and Project cover uploaders for later (optional)
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");

      await dbConnect();
      const user = await User.findOne({ email: session.user.email });
      if (!user) throw new Error("User not found");

      return { userId: user._id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

export default ourFileRouter;
