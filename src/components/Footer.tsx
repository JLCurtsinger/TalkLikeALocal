import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <p className="space-x-2">
          © {new Date().getFullYear()} Talk Like a Local. All rights reserved.
          <span>|</span>
          <Link to="/about" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">About Us</Link>
          <span>|</span>
          <a href="/blog" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Blog</a>
          <span>|</span>
          <Link to="/impact" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Our Impact</Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Terms of Service</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Privacy Policy</Link>
          <span>|</span>
          <Link to="/support" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Support Us</Link>
          <span>|</span>
          <a 
            href="https://elev8.dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline"
          >
            Produced by elev8.dev
          </a>
        </p>
      </div>
    </footer>
  );
}

