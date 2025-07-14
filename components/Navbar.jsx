"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // Scroll to section
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUsername(null);
    setUserRole(null);
    setProfileOpen(false);
    router.push("/login");
  };

  // Click outside dropdown to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user session
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");

    if (email) {
      setIsLoggedIn(true);
      setUsername(email);
      setUserRole(role);
    }
  }, [pathname]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#0071ce",
              cursor: "pointer",
            }}
          >
            Worklytix
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-[16px] text-gray-800 items-center font-medium">
          <button onClick={() => handleScroll("hero")} className="hover:text-[#0071ce] transition">
            Home
          </button>
          <Link href="/insights">
  <button className="hover:text-[#0071ce] transition">Insights</button>
</Link>
          {userRole === "admin" && (
            <Link href="/dashboard">
              <button className="hover:text-[#0071ce] transition">Dashboard</button>
            </Link>
          )}
          <button onClick={() => handleScroll("footer")} className="hover:text-[#0071ce] transition">
            Contact
          </button>

          {/* Profile or Login */}
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  background: "linear-gradient(to bottom right, #0071ce, #005bb5)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s",
                }}
                className="hover:scale-110"
              >
                <UserCircle />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden border z-50"
                  style={{ fontSize: "14px" }}
                >
                  <div className="px-4 py-2 text-gray-500 border-b">{username}</div>
                  <Link href="/profile">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex gap-2 items-center"
                  >
                    <LogOut style={{ width: "16px", height: "16px" }} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#0071ce",
                  color: "white",
                  fontWeight: "600",
                  transition: "all 0.3s",
                }}
                className="hover:bg-[#005bb5]"
              >
                Login
              </button>
            </Link>
          )}
        </nav>

        {/* Hamburger (mobile) */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden text-[#0071ce]">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white text-black transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          position: "fixed",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.8rem",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0071ce" }}>
            Menu
          </span>
          <button onClick={() => setMenuOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col text-lg font-semibold gap-6 mt-4">
          <button onClick={() => handleScroll("hero")} className="hover:text-[#0071ce]">Home</button>
          <button onClick={() => handleScroll("services")} className="hover:text-[#0071ce]">Services</button>
          {userRole === "admin" && (
            <Link href="/dashboard">
              <button className="hover:text-[#0071ce]">Dashboard</button>
            </Link>
          )}
          <button onClick={() => handleScroll("footer")} className="hover:text-[#0071ce]">Contact</button>
          {!isLoggedIn ? (
            <Link href="/login">
              <button className="hover:text-[#0071ce]">Login</button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 flex items-center gap-2 hover:underline"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
