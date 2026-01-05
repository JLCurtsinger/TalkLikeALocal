import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { states } from '../data/states';
import { cultures } from '../data/cultures';
import { MapPin, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Impact() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const statsSectionRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayStateTerms, setDisplayStateTerms] = useState(0);
  const [displayCultureTerms, setDisplayCultureTerms] = useState(0);

  useEffect(() => {
    if (location.hash === '#our-impact') {
      const impactSection = document.getElementById('our-impact');
      if (impactSection) {
        setTimeout(() => {
          const navbarHeight = 64;
          const padding = 24;
          const elementPosition = impactSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - padding;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location]);

  const totalStateTerms = states.reduce((total, state) => total + state.terms.length, 0);
  const totalCultureTerms = cultures.reduce((total, culture) => total + culture.terms.length, 0);
  const totalTerms = totalStateTerms + totalCultureTerms;

  // Count-up animation function
  useEffect(() => {
    if (hasAnimatedRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayTotal(totalTerms);
      setDisplayStateTerms(totalStateTerms);
      setDisplayCultureTerms(totalCultureTerms);
      hasAnimatedRef.current = true;
      return;
    }

    const animateCount = (
      start: number,
      end: number,
      duration: number,
      callback: (value: number) => void
    ) => {
      const startTime = performance.now();
      
      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        callback(current);
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          callback(end);
        }
      };
      
      requestAnimationFrame(update);
    };

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      const duration = 1000; // 1000ms
      animateCount(0, totalTerms, duration, setDisplayTotal);
      animateCount(0, totalStateTerms, duration, setDisplayStateTerms);
      animateCount(0, totalCultureTerms, duration, setDisplayCultureTerms);
    };

    // Use IntersectionObserver if available
    if ('IntersectionObserver' in window) {
      // Wait for ref to be attached
      const setupObserver = () => {
        if (statsSectionRef.current) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  startAnimation();
                  observer.disconnect();
                }
              });
            },
            { threshold: 0.1 }
          );
          
          observer.observe(statsSectionRef.current);
          
          return () => {
            observer.disconnect();
          };
        }
        return null;
      };

      // Try immediately, then retry after a short delay if ref not ready
      let cleanup = setupObserver();
      if (!cleanup) {
        const timeoutId = setTimeout(() => {
          cleanup = setupObserver();
        }, 100);
        return () => {
          clearTimeout(timeoutId);
          if (cleanup) cleanup();
        };
      }
      return cleanup;
    } else {
      // Fallback: start immediately
      startAnimation();
    }
  }, [totalTerms, totalStateTerms, totalCultureTerms]);

  const handleSuggestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/', { state: { scrollToSuggestions: true } });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Talk Like a Local - Our Impact',
      text: `Preserving ${totalTerms.toLocaleString()} local and cultural terms across the United States. Join us in preserving linguistic diversity!`,
      url: 'https://talklikealocal.org/impact#our-impact'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n\nLearn more at: ${shareData.url}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Helmet>
        <title>Our Impact | Preserving Linguistic Diversity Across the U.S.</title>
        <meta name="description" content={`Preserving ${totalTerms.toLocaleString()} local and cultural terms across the United States. Join our mission to document and protect regional pronunciations and indigenous languages.`} />
        <meta property="og:title" content="Our Impact | Preserving Linguistic Diversity Across the U.S." />
        <meta property="og:description" content={`Preserving ${totalTerms.toLocaleString()} local and cultural terms across the United States. Join our mission to protect linguistic diversity.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Impact | Preserving Linguistic Diversity Across the U.S." />
        <meta name="twitter:description" content={`Preserving ${totalTerms.toLocaleString()} local and cultural terms across the United States. Join our mission to protect linguistic diversity.`} />
        <link rel="canonical" href="https://talklikealocal.org/impact" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Our Impact",
            "description": `Preserving ${totalTerms.toLocaleString()} local and cultural terms across the United States.`,
            "publisher": {
              "@type": "Organization",
              "name": "Talk Like a Local"
            },
            "mainEntity": {
              "@type": "Dataset",
              "name": "U.S. Regional Pronunciations",
              "description": "Collection of regional pronunciations and cultural terms from across the United States",
              "keywords": ["pronunciations", "regional dialects", "cultural terms", "indigenous languages"],
              "creator": {
                "@type": "Organization",
                "name": "Talk Like a Local"
              },
              "temporalCoverage": "2024/...",
              "spatialCoverage": {
                "@type": "Country",
                "name": "United States"
              }
            }
          })}
        </script>
      </Helmet>
      
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Our Impact
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Preserving Local and Cultural Heritage, One Word at a Time
            </p>
          </div>

          <div id="our-impact" className="bg-white dark:bg-gray-900/10 rounded-lg shadow-md p-8 space-y-8 transition-colors">
            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Mission in Action</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                At Talk Like a Local, we're dedicated to preserving the rich tapestry of linguistic diversity across the United States. Each pronunciation we document helps maintain the authentic character of local communities and indigenous cultures, ensuring that this valuable heritage is passed on to future generations.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                In addition to local terms, we strive to preserve endangered languages and cultural terms, providing a resource for education and awareness. By including these terms, we aim to honor and protect the rich linguistic heritage of traditionally underserved cultures across the U.S.
              </p>
              
              <button
                onClick={handleShare}
                className="mt-6 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mx-auto"
                aria-label="Share our impact statistics"
              >
                <Share2 className="w-5 h-5" aria-hidden="true" />
                <span>Share Our Impact</span>
              </button>
            </section>

            <section ref={statsSectionRef} className="impact-stats-section rounded-lg p-8">
              <style>{`
                .impact-stats-section {
                  background: transparent;
                }
                .impact-stats-card {
                  background-color: rgba(255, 255, 255, 0.6);
                }
                .dark .impact-stats-card {
                  background-color: rgba(31, 41, 55, 0.5);
                }
                .impact-stat-number {
                  background: linear-gradient(to right, #2563eb, #9333ea);
                  -webkit-background-clip: text;
                  background-clip: text;
                  -webkit-text-fill-color: transparent;
                  color: transparent;
                }
              `}</style>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold impact-stat-number mb-2">
                  {displayTotal.toLocaleString()}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Total Terms Documented
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 impact-stats-card rounded-lg">
                  <h3 className="text-2xl font-bold impact-stat-number mb-2">
                    {displayStateTerms.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Local Terms
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Across {states.length} States
                  </p>
                </div>
                
                <div className="text-center p-4 impact-stats-card rounded-lg">
                  <h3 className="text-2xl font-bold impact-stat-number mb-2">
                    {displayCultureTerms.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Cultural Terms
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    From {cultures.length} Indigenous Cultures
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Why This Matters</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Every region and culture has its own way of speaking, and these unique pronunciations are part of what makes each community special. By documenting and sharing these variations, we help:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Preserve local dialects and cultural pronunciations for future generations</li>
                <li>Help visitors connect more authentically with local communities</li>
                <li>Celebrate the linguistic diversity of the United States</li>
                <li>Support the preservation of indigenous languages and pronunciations</li>
                <li>Prevent the homogenization of regional speech patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Join Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our database grows through the contributions of people like you. Every suggestion helps us build a more comprehensive resource for preserving local and cultural pronunciations.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleSuggestClick}
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200"
                >
                  Suggest a Term
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}