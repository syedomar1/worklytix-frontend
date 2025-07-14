import Head from "next/head";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
function Home() {
  return (
    <>
      <Head>
        <title>Walmart Supply Chain Dashboard</title>
      </Head>
      <main className="min-h-screen bg-[#f5f7fa] text-[#0a0a0a] font-sans">
        <Navbar />
        <Hero />
      </main>
    </>
  );
}

export default Home;