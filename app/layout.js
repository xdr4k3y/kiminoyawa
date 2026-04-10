import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import LoginModal from "@/components/LoginModal";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Kiminoyawa Gallery",
  description: "Kiminoyawa gallery website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable}`}>
        {children}
        <CartDrawer />
        <LoginModal />
      </body>
    </html>
  );
}
