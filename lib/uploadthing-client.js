import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// Define router type (for type safety only—actual server code stays server-side!)
const ourFileRouter = {};

export const { useUploadThing, uploadFiles } =
  generateReactHelpers(ourFileRouter);

export const UploadButton = generateUploadButton(ourFileRouter);
export const UploadDropzone = generateUploadDropzone(ourFileRouter);
