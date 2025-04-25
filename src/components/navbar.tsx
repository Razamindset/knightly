// ! Ai written code handle with intensive care

"use client"

import Link from "next/link";
import {
  FaChessKnight,
  FaGithub,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
} from "react-icons/fa";
import { FaCircleUser, FaRegChessKnight } from "react-icons/fa6";
import { useState } from "react";
import { FcAbout } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col border-r box-color border-gray-700 py-6 px-2 ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out h-screen sticky top-0 justify-between`}
    >
      <div>
        {/* Logo */}
        <div className="flex justify-center items-center mb-6">
          <Link
            href="/"
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <FaChessKnight size={30} className="text-green-500"/>
            {!isCollapsed && (
              <span className="text-white font-bold text-xl w-max">
                Knight Review
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-3">
          <Link
            href="/profile"
            className={`hover:text-gray-300 text-sm font-medium flex items-center gap-2 px-2 py-1 rounded-md ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <FaCircleUser size={30} />
            {!isCollapsed && <span>Profile</span>}
          </Link>

          <Link
            href="https://github.com/yourusername/chess-review"
            target="_blank"
            className={`hover:text-gray-300 text-sm font-medium flex items-center gap-2 px-2 py-1 rounded-md ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <SiGithub size={30} />
            {!isCollapsed && <span>GitHub</span>}
          </Link>

          <Link
            href="/about"
            className={`text-gray-300 hover:text-white text-sm font-medium flex items-center gap-2 px-2 py-1 rounded-md ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <FcAbout size={30} />
            {!isCollapsed && <span>About</span>}
          </Link>
        </div>
      </div>

      <button
        onClick={toggleCollapse}
        className="text-gray-300 hover:text-white focus:outline-none mb-4"
      >
        <div
          className={`flex items-center justify-center p-2 rounded-md hover:bg-gray-700 transition-transform duration-200`}
        >
          {isCollapsed ? (
            <FaChevronRight size={20} />
          ) : (
            <>
              <FaChevronLeft size={20} />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
