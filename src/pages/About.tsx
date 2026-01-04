import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Helmet>
        <title>About Talk Like a Local - Learn Regional Pronunciations & Cultural Terms</title>
        <meta name="description" content="Discover the mission behind Talk Like a Local, your guide to authentic regional pronunciations across the United States. Learn how we're preserving linguistic diversity." />
        <meta property="og:title" content="About Talk Like a Local - Learn Regional Pronunciations & Cultural Terms" />
        <meta property="og:description" content="Discover the mission behind Talk Like a Local, your guide to authentic regional pronunciations across the United States." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Talk Like a Local - Learn Regional Pronunciations & Cultural Terms" />
        <meta name="twitter:description" content="Discover the mission behind Talk Like a Local, your guide to authentic regional pronunciations across the United States." />
        <link rel="canonical" href="https://talklikealocal.org/about" />
      </Helmet>

      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-blue-500" aria-hidden="true" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Us
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 space-y-6 transition-colors">
            <section>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Welcome to TalkLikeaLocal.org!</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                At <strong>Talk Like a Local</strong>, we believe that the beauty of travel lies in the details—especially the way people speak. From regional quirks to place names with rich histories, our goal is to help you sound like a local, whether you're visiting for the first time or diving deeper into the cultural nuances of the United States.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                TalkLikeaLocal.org is a free, user-friendly resource dedicated to preserving and sharing authentic regional pronunciations across the U.S. It was created to eliminate confusion, foster cultural appreciation, and empower people to connect better with the places they visit.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our mission extends beyond local pronunciations to include the preservation of cultural terms and endangered languages. By creating a platform to showcase these valuable elements of heritage, we aim to support education, foster understanding, and contribute to the preservation of linguistic diversity in the U.S.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Why We Created This Site</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Have you ever traveled somewhere and mispronounced a place name, only to be corrected by a local? We know the feeling! This project was born out of a love for travel, language, and regional diversity. Our goal is to provide an educational, fun, and ever-growing database of terms that reflects the linguistic beauty and complexity of the U.S.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">What Makes Us Unique</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>Authenticity</strong>: Each term is carefully curated with input from locals and visitors alike, ensuring accuracy and cultural relevance.</li>
                <li><strong>Accessibility</strong>: We've designed the site to be simple and intuitive, so everyone can enjoy it—no user accounts, ads, or paywalls required.</li>
                <li><strong>Community-Driven</strong>: Our site grows with your help! Suggest terms you think should be added and help others learn how locals speak in your area.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">How You Can Help</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>Suggest Terms</strong>: Know a place or term that's commonly mispronounced? Use our "Make a Suggestion" feature to set the record straight.</li>
                <li><strong>Share the Site</strong>: Help us grow by sharing TalkLikeaLocal.org with your friends, family, and social circles.</li>
                <li><strong>Provide Feedback</strong>: We're always improving. Feel free to let us know how we can make the site better!</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">What's Next?</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We're just getting started! Currently, the site focuses on the United States, but we plan to expand to include pronunciations from other countries in the future. Our vision is to create a global resource where people can learn how to speak like locals, no matter where they travel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Thank You for Visiting!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We're so glad you're here and hope you find TalkLikeaLocal.org both useful and enjoyable. Whether you're planning your next adventure, brushing up on regional pronunciations, or simply curious, we're here to help you connect with the world—one word at a time.
              </p>
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
            <a href="/blog" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Blog</a>
            <span>|</span>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Terms of Service</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">Privacy Policy</Link>
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