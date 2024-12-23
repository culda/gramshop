"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlus, FaQuestion, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";
import { Logo } from "@/components/Logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* <header className="fixed z-20 top-0 right-0 text-gray-900 bg-white body-font">
        <div className="container mx-auto justify-between flex flex-wrap p-2 flex-col md:flex-row items-center">
          <AccountWidget platformLogin />
        </div>
      </header> */}
      <div className="relative flex flex-col md:flex-row md:items-stretch max-md:px-5 ">
        {/* Hamburger Icon */}
        <button
          className="md:hidden fixed bottom-5 right-5 z-50 text-4xl"
          onClick={toggleMenu}
        >
          {!isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              version="1.1"
              viewBox="0 0 32 32"
              width="32px"
            >
              <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
            </svg>
          ) : (
            <FaPlus className="transform rotate-45" />
          )}
        </button>

        {/* Menu */}
        <nav
          className={`bg-white fixed inset-0 z-40 flex text-center items-center justify-center ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-1/3 lg:w-[35%] h-screen overflow-y-auto md:overflow-y-visible`}
        >
          <ul className="list-none p-0 m-0">
            <li className="mb-4" onClick={toggleMenu}>
              <Link href={"/dashboard"}>
                <Logo />
              </Link>
            </li>
            <li className="mb-4" onClick={toggleMenu}>
              <Link
                href="/dashboard"
                className="text-black text-xl font-semibold whitespace-nowrap"
              >
                Shops
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link
                href="/dashboard/howto"
                className="text-black text-xl font-semibold whitespace-nowrap"
              >
                <div className="flex items-center justify-center">
                  <FaQuestionCircle />
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col items-stretch mt-16 w-full md:ml-[35%] lg:ml-[35%]">
          <div className="flex grow flex-col text-gray-900 overflow-auto relative min-h-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
