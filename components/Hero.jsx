'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWarehouse, FaTruckLoading, FaStore, FaUserTie } from 'react-icons/fa';

export default function Hero() {
  const router = useRouter();

  const handleRoleClick = (role) => {
    // ✅ Save role in sessionStorage
    sessionStorage.setItem('role', role);
    // ✅ Redirect to insights page
    router.push('/insights');
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2ff] to-[#f9f9ff] px-6 py-24 text-gray-800 overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-[#c4dfff] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#fcd9f3] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse z-0" />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold text-center mb-4 z-10"
        style={{ fontFamily: 'Arial, sans-serif', color: '#0071ce' }}
      >
        Welcome to Worklytix
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg text-center max-w-2xl mb-16 text-gray-600 z-10"
      >
        Empowering every layer of Walmart&apos;s operations with AI-driven insights.
      </motion.p>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 z-10 w-full max-w-6xl">
        {roles.map((role, index) => (
          <motion.div
            key={role.title}
            whileHover={{ scale: 1.06 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            onClick={() => handleRoleClick(role.title)}
            className={`rounded-2xl p-6 shadow-xl text-white flex flex-col items-center transition-all duration-300 cursor-pointer hover:shadow-2xl ${role.bg}`}
          >
            <div className="text-4xl mb-4">{role.icon}</div>
            <h3 className="text-lg font-bold mb-2 text-center">{role.title}</h3>
            <p className="text-sm text-center opacity-90">{role.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const roles = [
  {
    title: 'Supply Chain Manager',
    icon: <FaTruckLoading />,
    description: 'Monitor logistics, vendors, and global shipment flow.',
    bg: 'bg-gradient-to-tr from-[#42a5f5] to-[#478ed1]',
  },
  {
    title: 'Warehouse Ops Manager',
    icon: <FaWarehouse />,
    description: 'Track inventory, optimize layout, and manage operations.',
    bg: 'bg-gradient-to-tr from-[#ab47bc] to-[#7b1fa2]',
  },
  {
    title: 'Store Manager',
    icon: <FaStore />,
    description: 'Oversee sales, staffing, and in-store logistics.',
    bg: 'bg-gradient-to-tr from-[#ef5350] to-[#d32f2f]',
  },
  {
    title: 'Executive',
    icon: <FaUserTie />,
    description: 'Analyze performance, forecast trends, and strategize growth.',
    bg: 'bg-gradient-to-tr from-[#66bb6a] to-[#388e3c]',
  },
];
