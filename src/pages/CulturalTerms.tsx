import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { ChevronDown, ChevronRight, Globe } from 'lucide-react';
import { cultures } from '../data/cultures';
import { SearchBar } from '../components/SearchBar';
import { BackToTop } from '../components/BackToTop';
import { ShareButton } from '../components/ShareButton';
import { CopyLinkButton } from '../components/CopyLinkButton';
import { NestedAlphabetNav } from '../components/NestedAlphabetNav';
import { AlphabetNav } from '../components/AlphabetNav';
import { generateTermId, generateTermCardId } from '../utils/share';
import { Helmet } from 'react-helmet-async';
import { SparklesCore } from '../components/ui/sparkles';
import { useTheme } from '../contexts/ThemeContext';
import { scrollToHash } from '../utils/hashScroll';
import { buildCultureTermIndex } from '../utils/buildTermIndex';

export default function CulturalTerms() {
  const location = useLocation();
  const [expandedCultures, setExpandedCultures] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Build term index once on mount - O(n) operation
  const termIndex = useMemo(() => buildCultureTermIndex(cultures), []);

  // Disable browser scroll restoration when hash is present
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Hash navigation must override any saved letter/scroll state
    // If hash exists, handle it first and skip other scroll logic
    if (location.hash) {
      const hash = location.hash.slice(1);
      
      // Check if hash is a term ID (starts with "term-")
      if (hash.startsWith('term-')) {
        const termId = hash;
        
        // O(1) lookup in term index
        const termLocation = termIndex.get(termId);
        
        if (termLocation) {
          // Expand the culture FIRST, then scroll (expansion triggers re-render)
          setExpandedCultures(prev => new Set([...prev, termLocation.cultureName]));
          
          // Wait for expansion to complete before scrolling
          // Use requestAnimationFrame to ensure DOM has updated
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // Use reliable hash scrolling with retry logic
              scrollToHash({
                hash: termId,
                onElementFound: (element) => {
                  // Dev-only check: verify ID match
                  if (process.env.NODE_ENV === 'development') {
                    const expectedId = termId;
                    const actualId = element.id;
                    if (expectedId !== actualId) {
                      console.warn(`[Hash Scroll] ID mismatch! Expected: ${expectedId}, Actual: ${actualId}`);
                    } else {
                      console.log(`[Hash Scroll] Successfully found element with ID: ${actualId}`);
                    }
                  }
                  
                  // Apply highlight class
                  element.classList.add('highlighted-term');
                  // Remove highlight after 2 seconds
                  setTimeout(() => {
                    element.classList.remove('highlighted-term');
                  }, 2000);
                },
              });
            });
          });
        }
        // If term not found, fail gracefully (do nothing)
      } else {
        // Handle non-term hashes
        scrollToHash({ hash });
      }
      // Early return - hash navigation takes precedence
      return;
    }
  }, [location, termIndex]);

  // Handle hashchange events (when hash changes without page navigation)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const hash = window.location.hash.slice(1);
        
        if (hash.startsWith('term-')) {
          const termId = hash;
          
          // O(1) lookup in term index
          const termLocation = termIndex.get(termId);
          
          if (termLocation) {
            // Expand FIRST, then scroll
            setExpandedCultures(prev => new Set([...prev, termLocation.cultureName]));
            
            // Wait for expansion to complete
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                scrollToHash({
                  hash: termId,
                  onElementFound: (element) => {
                    element.classList.add('highlighted-term');
                    setTimeout(() => {
                      element.classList.remove('highlighted-term');
                    }, 2000);
                  },
                });
              });
            });
          }
          // If term not found, fail gracefully (do nothing)
        } else {
          scrollToHash({ hash });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [termIndex]);

  const toggleCulture = (cultureName: string) => {
    setExpandedCultures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cultureName)) {
        newSet.delete(cultureName);
      } else {
        newSet.add(cultureName);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (expandedCultures.size === cultures.length) {
      setExpandedCultures(new Set());
    } else {
      setExpandedCultures(new Set(cultures.map(c => c.name)));
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredCultures = cultures.filter(culture => {
    if (!searchTerm) return true;
    
    const matchesCultureName = culture.name.toLowerCase().includes(searchTerm);
    const matchesTerms = culture.terms.some(term => 
      term.word.toLowerCase().includes(searchTerm) ||
      term.description?.toLowerCase().includes(searchTerm)
    );
    
    return matchesCultureName || matchesTerms;
  });

  const allExpanded = expandedCultures.size === cultures.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Helmet>
        <title>Cultural Terms & Indigenous Pronunciations | Talk Like a Local</title>
        <meta name="description" content="Explore authentic pronunciations from Native American and indigenous cultures across the United States. Learn cultural terms, traditional words, and their meanings." />
        <meta property="og:title" content="Cultural Terms & Indigenous Pronunciations | Talk Like a Local" />
        <meta property="og:description" content="Explore authentic pronunciations from Native American and indigenous cultures across the United States." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cultural Terms & Indigenous Pronunciations | Talk Like a Local" />
        <meta name="twitter:description" content="Explore authentic pronunciations from Native American and indigenous cultures across the United States." />
        <link rel="canonical" href="https://talklikealocal.org/cultural-terms" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Cultural Terms & Indigenous Pronunciations",
            "description": "Explore authentic pronunciations from Native American and indigenous cultures across the United States.",
            "publisher": {
              "@type": "Organization",
              "name": "Talk Like a Local"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://talklikealocal.org"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Cultural Terms",
                  "item": "https://talklikealocal.org/cultural-terms"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="pt-12">
        <section className={`relative py-12 px-4 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
          {theme === 'dark' && !isMobile && (
            <div className="w-full absolute inset-0">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={0.5}
              />
            </div>
          )}
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-4 hero-animate">
              <img src="/favicon.svg" alt="" className="w-12 h-12" aria-hidden="true" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hero-animate-delay-1">
              Cultural Terms
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto hero-animate-delay-2">
              Exploring cultural heritage and preserving the beauty of language through education and understanding.
            </p>
            <Link 
              to="/" 
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200 mb-8 hero-animate-delay-3"
            >
              Local Terms
            </Link>
            <AlphabetNav />
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        <section id="cultures" className="max-w-7xl mx-auto px-4 py-12" aria-label="Cultural terms">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleAll}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              aria-label={allExpanded ? 'Collapse all sections' : 'Expand all sections'}
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
          
          <div className="space-y-4">
            {filteredCultures.map((culture) => (
              <CultureSection
                key={culture.name}
                culture={culture}
                isExpanded={expandedCultures.has(culture.name)}
                onToggle={() => toggleCulture(culture.name)}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="space-x-2">
            © {new Date().getFullYear()} Talk Like a Local. All rights reserved.
            <span>|</span>
            <Link to="/about" className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline">About Us</Link>
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
      
      <BackToTop />
    </div>
  );
}

interface CultureSectionProps {
  culture: any;
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
}

function CultureSection({ culture, isExpanded, onToggle, searchTerm }: CultureSectionProps) {
  // Check if this section is currently in view
  const [isInView, setIsInView] = React.useState(false);
  
  React.useEffect(() => {
    if (!isExpanded) {
      setIsInView(false);
      return;
    }

    const handleScroll = () => {
      const element = document.getElementById(generateTermId(culture.name));
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Consider in view if any part of the section is visible
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      setIsInView(isVisible);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded, culture.name]);

  const filteredTerms = searchTerm 
    ? culture.terms.filter((term: any) => 
        term.word.toLowerCase().includes(searchTerm) ||
        term.description?.toLowerCase().includes(searchTerm)
      )
    : culture.terms;

  return (
    <>
      <NestedAlphabetNav 
        terms={filteredTerms}
        sectionName={culture.name}
        isVisible={isExpanded && isInView}
      />
      
      <section id={generateTermId(culture.name)} className={`py-4 pr-20 ${!isExpanded ? 'pb-2' : ''}`}>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between text-left mb-2 group"
          aria-expanded={isExpanded}
          aria-controls={`content-${culture.name}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-flex items-center flex-wrap">
                  <span className="inline break-words">{culture.name}</span>
                  {culture.websiteUrl && (
                    <a
                      href={culture.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center ml-2 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Visit ${culture.name} official website`}
                    >
                      <Globe className="w-5 h-5 flex-shrink-0" />
                    </a>
                  )}
                </h2>
              </div>
              {culture.languageFamily && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {culture.languageFamily} Language Family
                </p>
              )}
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </div>
        </button>

        <div
          id={`content-${culture.name}`}
          className={`grid gap-4 transition-all duration-300 relative ${
            isExpanded ? 'opacity-100 mt-4' : 'opacity-0 h-0 overflow-hidden'
          }`}
        >
          {filteredTerms.map((term: any, index: number) => (
            <div 
              key={`${culture.name}-${term.word}-${index}`}
              id={generateTermCardId(term.word)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors scroll-mt-24 relative z-10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold dark:text-white">{term.word}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{term.phonetic}</p>
                  {term.description && (
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{term.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-0">
                  <ShareButton term={term} context="Cultural Terms" />
                  <CopyLinkButton term={term} context="Cultural Terms" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}