import { SessionProvider } from "next-auth/react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const giestSansInter = Inter({
  subsets: ["latin"],
  variable: "--font-giest-sans-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "Shiplog | Developer Identity Platform",
  description: "Developer identity platform for building your professional profile",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${giestSansInter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
