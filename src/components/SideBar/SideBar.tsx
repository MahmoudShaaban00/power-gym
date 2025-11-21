"use client";

import React, { useState } from "react";
import { FiHome, FiUsers, FiLayers, FiUserCheck, FiUserPlus,FiCreditCard, FiFileText, FiMenu } from "react-icons/fi";
import Link from "next/link";
const links = [
  { name: "التحكم", href: "/dashboard", icon: <FiHome /> },
  { name: "الاعضاء", href: "/dashboard/members", icon: <FiUsers /> },
  { name: "التخصصات", href: "/dashboard/createspecialization", icon: <FiLayers /> },
  { name: "انشاء متخصص", href: "/dashboard/createtrainer", icon: <FiUserPlus /> },
  { name: "المتخصصون", href: "/dashboard/Trainers", icon: <FiUserCheck /> },
  { name: "انشاء اشتراكات", href: "/dashboard/createsubscription", icon: <FiCreditCard /> },
  { name: "العمليات على الاشتراكات", href: "/dashboard/updatesubscription", icon: <FiFileText /> },
  { name: "انشاء عضو", href: "/dashboard/createmember", icon: <FiUserPlus /> },
  { name: "العمليات على الاعضاء", href: "/dashboard/operationsmember", icon: < FiFileText /> },
];
export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-gradient-to-b from-indigo-900 to-purple-900 p-5 pt-8 relative duration-300`}
      >
        {/* Toggle Button */}
        <FiMenu
          className={`absolute cursor-pointer -right-3 top-9 w-7 h-7 bg-white rounded-full border border-indigo-700 ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />

        {/* Logo */}
        <div className="flex gap-x-4 items-center">
          <div className="bg-white text-indigo-700 font-bold text-xl rounded-md px-2 py-1">
            {open ? "لوحة التحكم" : "لو"}
          </div>
        </div>

        {/* Links */}
        <ul className="pt-6">
          {links.map((link) => (
            <li
              key={link.href}
              className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-indigo-700 text-white text-sm"
            >
              <span className="text-lg">{link.icon}</span>
              <Link
                href={link.href}
                className={`${!open && "hidden"} origin-left duration-200`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
