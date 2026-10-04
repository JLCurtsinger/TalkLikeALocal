import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StateSection } from './components/StateSection';
import { BackToTop } from './components/BackToTop';
import { AlphabetNav } from './components/AlphabetNav';
import { SuggestionsForm } from './components/SuggestionsForm';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { states } from './data/states';
import { generateTermId } from './utils/share';
import { Term } from './types';
import { Helmet } from 'react-helmet-async';
import { SparklesCore } from './components/ui/sparkles';
import { useTheme } from './contexts/ThemeContext';
import { scrollToHash } from './utils/hashScroll';
import { buildStateTermIndex } from './utils/buildTermIndex';

/** Pending hash scroll: expand section first, then scroll once laid out */
interface PendingHashScroll {
  elementId: string;
  sectionName: string;
  highlight?: boolean;
}

export default function App() {
  const location = useLocation();
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [pendingHashScroll, setPendingHashScroll] = useState<PendingHashScroll | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTermsMap, setFilteredTermsMap] = useState<Map<string, Term[]>>(new Map());
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isAboveFold, setIsAboveFold] = useState(true);

  // Build term index once on mount - O(n) operation
  const termIndex = useMemo(() => buildStateTermIndex(states), []);

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
    const handleScroll = () => {
      // Consider "above fold" to be first 100vh
      setIsAboveFold(window.scrollY < window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Stage 1: resolve hash → expand the owning section → queue pending scroll target.
   * Does not scroll yet; scrolling waits until the section is expanded and laid out.
   */
  const queueHashNavigation = useCallback((rawHash: string) => {
    const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
    if (!hash) {
      setPendingHashScroll(null);
      return;
    }

    if (hash.startsWith('term-')) {
      const termId = hash;
      const termLocations = termIndex.get(termId);

      let selectedLocation: { stateName: string; letter: string } | null = null;

      if (termLocations && termLocations.length > 0) {
        // Stable deterministic choice when a term exists in multiple states
        selectedLocation = termLocations[0];
      } else {
        // Index miss — try DOM fallback (e.g. already-rendered expanded content)
        const element = document.getElementById(termId);
        if (element) {
          const stateSection = element.closest('section[id]');
          if (stateSection) {
            const stateName = states.find(
              (state) => generateTermId(state.name) === stateSection.id
            )?.name;
            if (stateName) {
              selectedLocation = {
                stateName,
                letter: termId.replace('term-', '')[0]?.toUpperCase() || '',
              };
            }
          }
        }
      }

      if (!selectedLocation) {
        // Unknown term hash — fail gracefully, do not retry forever
        setPendingHashScroll(null);
        return;
      }

      const targetStateName = selectedLocation.stateName;
      setExpandedStates((prev) => {
        if (prev.has(targetStateName)) return prev;
        return new Set([...prev, targetStateName]);
      });
      setPendingHashScroll({
        elementId: termId,
        sectionName: targetStateName,
        highlight: true,
      });
      return;
    }

    // Non-term hashes (state sections): #massachusetts or #states/massachusetts
    let stateSlug = hash;
    if (hash.startsWith('states/')) {
      stateSlug = hash.replace('states/', '');
    }

    const matchingState = states.find(
      (state) => generateTermId(state.name) === stateSlug
    );

    if (matchingState) {
      const targetStateName = matchingState.name;
      const stateId = generateTermId(targetStateName);
      setExpandedStates((prev) => {
        if (prev.has(targetStateName)) return prev;
        return new Set([...prev, targetStateName]);
      });
      setPendingHashScroll({
        elementId: stateId,
        sectionName: targetStateName,
        highlight: false,
      });
      return;
    }

    // Other hash targets (e.g. #suggestions) — scroll without requiring a section expand
    const element = document.getElementById(hash);
    if (element) {
      const stateSection = element.closest('section[id]');
      const stateName = stateSection
        ? states.find((state) => generateTermId(state.name) === stateSection.id)?.name
        : undefined;

      if (stateName) {
        setExpandedStates((prev) => {
          if (prev.has(stateName)) return prev;
          return new Set([...prev, stateName]);
        });
        setPendingHashScroll({
          elementId: hash,
          sectionName: stateName,
          highlight: false,
        });
      } else {
        // No accordion ownership — scroll when laid out
        setPendingHashScroll({
          elementId: hash,
          sectionName: '',
          highlight: false,
        });
      }
    } else {
      setPendingHashScroll(null);
    }
  }, [termIndex]);

  // Stage 1 trigger: React Router location hash (cold load + in-app navigation)
  useEffect(() => {
    if (location.hash) {
      queueHashNavigation(location.hash);
      return;
    }

    setPendingHashScroll(null);

    // Only run other scroll logic if no hash is present
    if (location.state?.scrollToSuggestions) {
      setTimeout(() => {
        const suggestionsSection = document.getElementById('suggestions');
        if (suggestionsSection) {
          const navbarHeight = 64;
          const padding = 24;
          const elementPosition = suggestionsSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - padding;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location, queueHashNavigation]);

  // Stage 1 trigger: native hashchange (covers hash updates that still need handling)
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

  // Stage 2: scroll only after the owning section is expanded (and target has layout)
  useEffect(() => {
    if (!pendingHashScroll) return;

    const { elementId, sectionName, highlight } = pendingHashScroll;

    // Wait until the accordion section is expanded (empty sectionName = no accordion gate)
    if (sectionName && !expandedStates.has(sectionName)) {
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
  }, [pendingHashScroll, expandedStates]);

  useEffect(() => {
    // Google Analytics
    const gtagScript = document.createElement('script');
    gtagScript.setAttribute('async', '');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-FN0HZJGXG8';
    document.head.appendChild(gtagScript);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FN0HZJGXG8');
    `;
    document.head.appendChild(inlineScript);
  }, []);

  const toggleState = (stateName: string) => {
    setExpandedStates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stateName)) {
        newSet.delete(stateName);
      } else {
        newSet.add(stateName);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (expandedStates.size === states.length) {
      setExpandedStates(new Set());
    } else {
      setExpandedStates(new Set(states.map(s => s.name)));
    }
  };

  const handleSearch = (term: string) => {
    const searchTermLower = term.toLowerCase();
    setSearchTerm(searchTermLower);

    const newFilteredTermsMap = new Map<string, Term[]>();

    states.forEach(state => {
      const filteredTerms = state.terms.filter(term => 
        term.word.toLowerCase().includes(searchTermLower) ||
        term.description?.toLowerCase().includes(searchTermLower)
      );

      if (filteredTerms.length > 0) {
        newFilteredTermsMap.set(state.name, filteredTerms);
        if (searchTermLower) {
          setExpandedStates(prev => new Set([...prev, state.name]));
        }
      }
    });

    setFilteredTermsMap(newFilteredTermsMap);
  };

  const filteredStates = states.filter(state => {
    if (!searchTerm) return true;
    return filteredTermsMap.has(state.name);
  });

  const allExpanded = expandedStates.size === states.length;

  const totalTerms = states.reduce((total, state) => total + state.terms.length, 0);

  // Only show stars if in dark mode, not mobile, and above fold
  const showStars = theme === 'dark' && (!isMobile || (isMobile && isAboveFold));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Helmet>
        <title>Talk Like a Local | Learn Regional Pronunciations Across the U.S.</title>
        <meta name="description" content={`Discover how to pronounce ${totalTerms.toLocaleString()} local terms across the United States. Learn authentic regional pronunciations from locals and sound like a native.`} />
        <meta property="og:title" content="Talk Like a Local | Learn Regional Pronunciations Across the U.S." />
        <meta property="og:description" content={`Discover how to pronounce ${totalTerms.toLocaleString()} local terms across the United States. Learn authentic regional pronunciations from locals.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talk Like a Local | Learn Regional Pronunciations Across the U.S." />
        <meta name="twitter:description" content={`Discover how to pronounce ${totalTerms.toLocaleString()} local terms across the United States. Learn authentic regional pronunciations from locals.`} />
        <link rel="canonical" href="https://talklikealocal.org" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Talk Like a Local",
            "url": "https://talklikealocal.org",
            "description": `Learn how to pronounce ${totalTerms.toLocaleString()} local terms across the United States.`,
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://talklikealocal.org/#states",
              "query-input": "required name=search_term"
            }
          })}
        </script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7469694080179788"
          crossOrigin="anonymous"
        />
      </Helmet>

      <Navigation />
      
      <main className="pt-12">
        <section className={`relative py-12 px-4 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
          {showStars && (
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
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-4 hero-animate">
              <img src="/favicon.svg" alt="" className="w-12 h-12" aria-hidden="true" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight hero-animate-delay-1">
              Learn to Talk Like a Local Across the U.S.!
            </h1>
            <p className={`text-xl sm:text-2xl mb-6 max-w-3xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hero-animate-delay-2`}>
              Discover how locals say things in each state. 
              Click a letter below to explore words from Alabama to Wyoming.
            </p>
            <AlphabetNav />
            <SearchBar onSearch={handleSearch} />
            <div className="flex flex-wrap gap-4 justify-center mt-6 hero-animate-delay-3">
              <Link 
                to="/cultural-terms" 
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200"
              >
                Cultural Terms
              </Link>
            </div>
          </div>
        </section>

        <section id="states" className="max-w-7xl mx-auto px-4 py-12" aria-label="State pronunciations">
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
            {filteredStates.map((state) => (
              <StateSection
                key={state.abbreviation}
                state={state}
                isExpanded={expandedStates.has(state.name)}
                onToggle={() => toggleState(state.name)}
                filteredTerms={searchTerm ? filteredTermsMap.get(state.name) : undefined}
              />
            ))}
          </div>
        </section>

        <section id="blog" className="max-w-7xl mx-auto px-4 py-16" aria-label="Blog">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              From Our Blog
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Explore pronunciation guides, cultural insights, and language preservation stories.
            </p>
            <a 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200"
            >
              View All Blog Posts →
            </a>
          </div>
        </section>

        <section id="suggestions" className="max-w-2xl mx-auto px-4 py-16" aria-label="Suggest a pronunciation">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Suggest a New Term
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Know a commonly mispronounced place or term? Help others learn the correct pronunciation by submitting it below.
            </p>
          </div>
          <SuggestionsForm />
        </section>
      </main>

      <Footer />
      
      <BackToTop />
    </div>
  );
}