"use client";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import { SessionProvider } from "next-auth/react";
import { FC } from "react";
import { useUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./utils/Loader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
  display: "swap",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin-Sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefinSans.variable} antialiased !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-800 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
            >
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useUserQuery({
    refetchOnWindowFocus: false,
  });
  return <>{isLoading ? <Loader /> : <>{children}</>}</>;
};
