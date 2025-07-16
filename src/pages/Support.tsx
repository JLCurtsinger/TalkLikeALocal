import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Support() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Helmet>
        <title>Support Talk Like a Local | Help Preserve Regional Pronunciations</title>
        <meta name="description" content="Support our mission to preserve regional pronunciations and cultural terms across the United States. Your contribution helps maintain this free educational resource." />
        <meta property="og:title" content="Support Talk Like a Local | Help Preserve Regional Pronunciations" />
        <meta property="og:description" content="Support our mission to preserve regional pronunciations and cultural terms across the United States." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Support Talk Like a Local | Help Preserve Regional Pronunciations" />
        <meta name="twitter:description" content="Support our mission to preserve regional pronunciations and cultural terms across the United States." />
        <link rel="canonical" href="https://talklikealocal.org/support" />
      </Helmet>
      
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-blue-500" aria-hidden="true" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Support Us
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 space-y-6 transition-colors">
            <section className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                At <strong>TalkLikeaLocal.org</strong>, we're dedicated to providing a free, educational resource for travelers, language enthusiasts, and anyone curious about regional pronunciations across the U.S. This project is run by a one-man team, driven by a love for language and culture.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300">
                If you've found value in this site, consider making a donation to help keep Talk Like a Local running. Every contribution supports hosting costs, content updates, and improvements. While donations are greatly appreciated, they're never expected—this is, and always will be, a free resource for the community.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for your support!
              </p>

              <div className="flex justify-center gap-4 pt-4">
                <a
                  href="https://buy.stripe.com/9AQ5lu09K21Af1S7ss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Donate Now
                </a>
                <a
                  href="https://talklikealocal.printful.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Merchandise
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="space-x-2">
            © {new Date().getFullYear()} Talk Like a Local. All rights reserved.
            <span>|</span>
            <Link to="/about" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">About Us</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Terms of Service</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Privacy Policy</Link>
            <span>|</span>
            <Link to="/support" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Support Us</Link>
            <span>|</span>
            <a 
              href="https://talklikealocal.printful.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline"
            >
              Merchandise
            </a>
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
    </div>
  );
}