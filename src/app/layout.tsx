import React from 'react';

import type { Metadata } from "next";

// importing styles
import "../styles/globals.css";

// importing components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = 
{
  title: "Daniel Kindl",
  description: "My Personal Website (Portfolio) version 2 :)",
};

export default function RootLayout({ children }: Readonly< { children: React.ReactNode; } >)
{
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
