// pages/index.js
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Walmart Supply Chain Dashboard</title>
      </Head>
      <main
        className={`${geistSans.variable} font-sans min-h-screen flex items-center justify-center`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Walmart Ops</h1>
          <p className="text-gray-600">
            Your AI-powered supply chain analytics portal
          </p>
        </div>
      </main>
    </>
  );
}
