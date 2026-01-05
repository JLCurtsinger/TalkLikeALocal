import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Helmet>
        <title>Terms of Service | Talk Like a Local</title>
        <meta name="description" content="Read our Terms of Service to understand how to use Talk Like a Local responsibly. Learn about user submissions, intellectual property, and website usage guidelines." />
        <meta property="og:title" content="Terms of Service | Talk Like a Local" />
        <meta property="og:description" content="Read our Terms of Service to understand how to use Talk Like a Local responsibly." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms of Service | Talk Like a Local" />
        <meta name="twitter:description" content="Read our Terms of Service to understand how to use Talk Like a Local responsibly." />
        <link rel="canonical" href="https://talklikealocal.org/terms" />
      </Helmet>
      
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-blue-500" aria-hidden="true" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>

          <div className="bg-blue-50/5 dark:bg-gray-900/10 rounded-lg shadow-md p-8 space-y-6 transition-colors">
            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing and using TalkLikeALocal.org, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">2. User Submissions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                When you submit pronunciation suggestions through our form, you grant us the right to use, modify, and display the submitted content on our website. You represent that your submissions are accurate to the best of your knowledge.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">3. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-300">
                All content on this website, including but not limited to text, graphics, logos, and audio files, is the property of TalkLikeALocal.org and is protected by copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">4. Disclaimer</h2>
              <p className="text-gray-600 dark:text-gray-300">
                While we strive for accuracy in our pronunciation guides, we cannot guarantee the absolute correctness of all pronunciations. Local variations may exist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">5. Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We respect your privacy and handle all user submissions in accordance with our privacy practices. We do not share personal information with third parties.
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