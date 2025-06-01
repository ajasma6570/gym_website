"use client";

import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black  text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Gym Info Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                PowerFit Gym
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Transform your body and mind with our state-of-the-art facility
                and expert trainers. Join our fitness community today!
              </p>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  Membership Plans
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  Classes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  Personal Training
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-300">Strength Training</li>
              <li className="text-gray-300">Cardio Workouts</li>
              <li className="text-gray-300">Yoga & Flexibility</li>
              <li className="text-gray-300">CrossFit & HIIT</li>
              <li className="text-gray-300">Nutrition Consulting</li>
              <li className="text-gray-300">Group Classes</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    123 Fitness Street
                    <br />
                    Gym City, GC 12345
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaPhone className="text-red-600 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-red-600 flex-shrink-0" />
                <a
                  href="mailto:info@powerfitgym.com"
                  className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                >
                  info@powerfitgym.com
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <FaClock className="text-red-600 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p className="font-medium mb-1">Operating Hours:</p>
                  <p className="text-sm">Mon-Fri: 5:00 AM - 11:00 PM</p>
                  <p className="text-sm">Sat-Sun: 6:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-900 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Gym. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
