import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
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

/** Pending hash scroll: expand culture first, then scroll once laid out */
interface PendingHashScroll {
  elementId: string;
  sectionName: string;
  highlight?: boolean;
}

export default function CulturalTerms() {
  const location = useLocation();
  const [expandedCultures, setExpandedCultures] = useState<Set<string>>(new Set());
  const [pendingHashScroll, setPendingHashScroll] = useState<PendingHashScroll | null>(null);
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

  /**
   * Stage 1: resolve hash → expand the owning culture → queue pending scroll target.
   */
  const queueHashNavigation = useCallback((rawHash: string) => {
    const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
    if (!hash) {
      setPendingHashScroll(null);
      return;
    }

    if (hash.startsWith('term-')) {
      const termId = hash;
      const termLocation = termIndex.get(termId);

      if (!termLocation) {
        // Unknown term hash — fail gracefully
        setPendingHashScroll(null);
        return;
      }

      setExpandedCultures((prev) => {
        if (prev.has(termLocation.cultureName)) return prev;
        return new Set([...prev, termLocation.cultureName]);
      });
      setPendingHashScroll({
        elementId: termId,
        sectionName: termLocation.cultureName,
        highlight: true,
      });
      return;
    }

    // Non-term hashes — scroll when laid out
    setPendingHashScroll({
      elementId: hash,
      sectionName: '',
      highlight: false,
    });
  }, [termIndex]);

  // Stage 1 trigger: React Router location hash
  useEffect(() => {
    if (location.hash) {
      queueHashNavigation(location.hash);
    } else {
      setPendingHashScroll(null);
    }
  }, [location, queueHashNavigation]);

  // Stage 1 trigger: native hashchange
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        queueHashNavigation(window.location.hash);
      } else {
        setPendingHashScroll(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [queueHashNavigation]);

  // Stage 2: scroll only after the owning culture is expanded (and target has layout)
  useEffect(() => {
    if (!pendingHashScroll) return;

    const { elementId, sectionName, highlight } = pendingHashScroll;

    if (sectionName && !expandedCultures.has(sectionName)) {
      return;
    }

    const cancel = scrollToHash({
      hash: elementId,
      requireLayout: true,
      onElementFound: (element) => {
        if (highlight) {
          element.classList.add('highlighted-term');
          setTimeout(() => {
            element.classList.remove('highlighted-term');
          }, 2000);
        }
        setPendingHashScroll(null);
      },
      onGiveUp: () => {
        setPendingHashScroll(null);
      },
    });

    return cancel;
  }, [pendingHashScroll, expandedCultures]);

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
            <AlphabetNav />
            <SearchBar onSearch={handleSearch} />
            <Link 
              to="/" 
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200 mt-4 mb-8 hero-animate-delay-3"
            >
              Local Terms
            </Link>
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

      <Footer />
      
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
              className="bg-white/15 dark:bg-gray-800/15 rounded-lg shadow-md p-6 transition-colors scroll-mt-24 relative z-10"
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