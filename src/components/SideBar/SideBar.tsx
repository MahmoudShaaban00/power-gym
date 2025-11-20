"use client";

import React, { useState } from "react";
import { FiHome, FiUser, FiFolderPlus, FiClipboard, FiUserPlus, FiList, FiMenu } from "react-icons/fi";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      {/* ✅ Sidebar */}
      <div
        className={`${open ? "w-64" : "w-20"
          }  bg-gradient-to-b from-indigo-900 to-purple-900 p-5 pt-8 relative duration-300`}
      >
        {/* Toggle Button */}
        <FiMenu
          className={`absolute cursor-pointer -right-3 top-9 w-7 h-7 bg-white rounded-full border border-indigo-700 ${!open && "rotate-180"
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
          <li className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-indigo-700 text-white text-sm">
            <FiHome className="text-lg" />
            <Link href="/dashboard" className={`${!open && "hidden"} origin-left duration-200`}>
              التحكم
            </Link>
          </li>
          <li className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-indigo-700 text-white text-sm">
            <FiUser className="text-lg" />
            <Link href="/dashboard/users" className={`${!open && "hidden"} origin-left duration-200`}>
              الاعضاء
            </Link>
          </li>
          <li className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-indigo-700 text-white text-sm">
            <FiFolderPlus className="text-lg" />
            <Link href="/dashboard/createsubscription" className={`${!open && "hidden"} origin-left duration-200`}>
              انشاء اشتراكات
            </Link>
          </li>
          <li className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-indigo-700 text-white text-sm">
            <FiClipboard className="text-lg" />
            <Link href="/dashboard/updatesubscription" className={`${!open && "hidden"} origin-left duration-200`}>
              العمليات على الاشتراكات
            </Link>
          </li>
          <li className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-indigo-700 text-white text-sm">
            <FiUserPlus className="text-lg" />
            <Link href="/dashboard/createmember" className={`${!open && "hidden"} origin-left duration-200`}>
              انشاء عضو
            </Link>
          </li>
          <li className="flex items-center gap-x-4 p-2 rounded-md cursor-pointer hover:bg-indigo-700 text-white text-sm">
            <FiList className="text-lg" />
            <Link href="/dashboard/operationsmember" className={`${!open && "hidden"} origin-left duration-200`}>
              العمليات على الاعضاء
            </Link>
          </li>
        </ul>

      </div>


    </div>
  );
}
