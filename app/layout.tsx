import "./globals.css";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import Header from "@/components/Header";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Header />

        {children}

        <footer style={{ padding: 16, borderTop: "1px solid #222", marginTop: 24 }}>
          © Arty4Gems
        </footer>
      </body>
    </html>
  );
}