import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Helmet>
        <title>Privacy Policy | Talk Like a Local</title>
        <meta name="description" content="Learn how Talk Like a Local protects your privacy and handles user data. Our commitment to safeguarding your information while preserving linguistic diversity." />
        <meta property="og:title" content="Privacy Policy | Talk Like a Local" />
        <meta property="og:description" content="Learn how Talk Like a Local protects your privacy and handles user data." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy | Talk Like a Local" />
        <meta name="twitter:description" content="Learn how Talk Like a Local protects your privacy and handles user data." />
        <link rel="canonical" href="https://talklikealocal.org/privacy" />
      </Helmet>
      
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-blue-500" aria-hidden="true" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>

          <div className="bg-blue-50/10 dark:bg-gray-900 rounded-lg shadow-md p-8 space-y-6 transition-colors">
            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">1. Information Collection</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We collect information that you voluntarily provide when submitting pronunciation suggestions, including the term, pronunciation, and any additional context you provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">2. Use of Information</h2>
              <p className="text-gray-600 dark:text-gray-300">
                The information you provide is used solely for the purpose of improving our pronunciation database and enhancing the user experience on TalkLikeALocal.org.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">3. Data Protection</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">4. Information Sharing</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We do not sell, trade, or otherwise transfer your information to third parties. Your submissions may be displayed publicly on our website as part of our pronunciation guide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">5. User Rights</h2>
              <p className="text-gray-600 dark:text-gray-300">
                You have the right to request access to, correction of, or deletion of your information at any time by contacting us.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}