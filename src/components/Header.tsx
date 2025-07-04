"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosCall } from "react-icons/io";
// import { RxHamburgerMenu } from "react-icons/rx";
// import { IoClose } from "react-icons/io5";
// import { menuItems } from "@/lib/staticData/data";
import Image from "next/image";
import { motion } from "framer-motion";

const Header = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  function useScrollAndScreen() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 50);
      };

      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 640); // Tailwind's sm breakpoint
      };

      // Initialize on mount
      handleScroll();
      handleResize();

      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return { isScrolled, isSmallScreen };
  }
  const { isScrolled, isSmallScreen } = useScrollAndScreen();

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-transparent backdrop-blur-md shadow-lg" : "bg-none "
      }`}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-24 text-left">
        <div
          className={`flex justify-between items-center transform transition-all duration-300 ${
            isScrolled ? "h-16" : "h-30"
          }`}
        >
          {/* Logo/Icon - Left Side */}
          <motion.div
            key="logo-header"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo-bg-none.webp"
                alt="Logo"
                width={isSmallScreen ? 150 : isScrolled ? 150 : 150}
                height={isSmallScreen ? 100 : isScrolled ? 100 : 150}
              />
              {/* /<span
                className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? "text-white" : "text-white"
                  }`}
              >
                Anatomy */}
              {/* </span> */}
            </Link>
          </motion.div>

          {/* Desktop Navigation - Center */}
          {/* <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-md font-medium transition-colors duration-200 text-white hover:text-red-600`}
              >
                {item.label}
              </Link>
            ))}
          </nav> */}

          {/* Call Button - Right Side (Desktop) */}
          <motion.div
            key="call-button-header"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center"
          >
            <a
              href="tel:+1234567890"
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                isScrolled
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <IoIosCall className="h-5 w-5 mr-1.5" />
              <span className="text-sm font-medium">Call Now</span>
            </a>
          </motion.div>

          {/* Mobile menu button */}
          {/* <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200  `}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <RxHamburgerMenu
                className={`h-7 w-7 text-red-600 ${
                  isMenuOpen ? "hidden" : "block"
                }`}
              />
              <IoClose
                className={`h-7 w-7 text-red-600 ${
                  isMenuOpen ? "block" : "hidden"
                }`}
              />
            </button>
          </div> */}
        </div>
      </div>

      {/* <div
        className={`md:hidden fixed inset-0 top-0 z-40 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black backdrop-blur-xl opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-full w-64 max-w-xs transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full bg-black shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-red-600">
              <span className="text-xl text-white font-bold">Logo</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md"
              >
                <IoClose
                  className={`h-7 w-7 text-red-600 hover:text-red-700 `}
                />
              </button>
            </div>

            <div className="py-4">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-6 py-4 text-white  hover:bg-red-600 hover:text-white transition-all duration-200 transform ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-base font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="px-6 py-4">
                <a
                  href="tel:+1234567890"
                  className={`flex items-center justify-center w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-200 transform ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen
                      ? `${menuItems.length * 50}ms`
                      : "0ms",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IoIosCall className="h-5 w-5 mr-2" />
                  <span className="text-base font-medium">Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </header>
  );
};

export default Header;
