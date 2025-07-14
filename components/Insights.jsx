"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ChatInterface from "@/components/ChatInterface";
import Navbar from "@/components/Navbar";
import { FileDown } from "lucide-react";

export default function InsightsPage() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const downloadReport = async (type) => {
    try {
      const res = await fetch(`${backend}/report/${type}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}_report.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("❌ Failed to download report.");
      console.error(error);
    }
  };

  const renderDownloadButtons = () => {
    const buttonClass =
      "flex items-center gap-2 text-sm font-medium bg-[#0071ce] text-white px-3 py-2 rounded-md hover:bg-[#005bb5] transition";

    switch (role) {
      case "Warehouse Ops Manager":
        return (
          <button onClick={() => downloadReport("warehouse")} className={buttonClass}>
            <FileDown size={16} /> Download Warehouse Report
          </button>
        );
      case "Store Manager":
        return (
          <button onClick={() => downloadReport("store")} className={buttonClass}>
            <FileDown size={16} /> Download Store Report
          </button>
        );
      case "Executive":
        return (
          <button onClick={() => downloadReport("executive")} className={buttonClass}>
            <FileDown size={16} /> Download Executive Report
          </button>
        );
      case "Supply Chain Manager":
        return (
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => downloadReport("warehouse")} className={buttonClass}>
              <FileDown size={16} /> Warehouse Report
            </button>
            <button onClick={() => downloadReport("store")} className={buttonClass}>
              <FileDown size={16} /> Store Report
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderChatBasedOnRole = () => {
    switch (role) {
      case "Warehouse Ops Manager":
        return (
          <ChatInterface
            defaultEndpoint={`${backend}/query/warehouse`}
            role="Warehouse Ops Manager"
          />
        );
      case "Store Manager":
        return (
          <ChatInterface
            defaultEndpoint={`${backend}/query/store`}
            role="Store Manager"
          />
        );
      case "Executive":
        return (
          <ChatInterface
            defaultEndpoint={`${backend}/query/executive`}
            role="Executive"
          />
        );
      case "Supply Chain Manager":
        return (
          <ChatInterface
            defaultEndpoint={`${backend}/query/warehouse`}
            role="Supply Chain Manager"
          />
        );
      default:
        return (
          <div className="text-center mt-20 text-gray-600">
            Role not recognized. Please contact admin.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-32 text-center text-gray-500 text-lg">
          Loading Insights...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 px-6 md:px-12">
        {/* Report Download Buttons */}
        <div className="mb-6 text-center">{renderDownloadButtons()}</div>
        {renderChatBasedOnRole()}
      </div>
    </>
  );
}
