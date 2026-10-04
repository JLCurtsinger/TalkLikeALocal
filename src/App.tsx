import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

export default function App() {
  const location = useLocation();
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    // Hash navigation must override any saved letter/scroll state
    // If hash exists, handle it first and skip other scroll logic
    if (location.hash) {
      const hash = location.hash.slice(1);
      
      // Check if hash is a term ID (starts with "term-")
      if (hash.startsWith('term-')) {
        const termId = hash;
        
        // DEV-only logging for term-agave debugging
        if (import.meta.env.DEV && termId === 'term-agave') {
          console.log('[Hash Navigation] Processing term-agave');
          console.log('[Hash Navigation] Target ID:', termId);
        }
        
        // O(1) lookup in term index (now returns array)
        const termLocations = termIndex.get(termId);
        
        let selectedLocation: { stateName: string; letter: string } | null = null;
        
        if (termLocations && termLocations.length > 0) {
          // If multiple states have this term, prefer the one matching current route
          // For now, since we don't have state-specific routes, just use the first one
          // (stable deterministic choice)
          selectedLocation = termLocations[0];
          
          if (import.meta.env.DEV && termId === 'term-agave') {
            console.log('[Hash Navigation] Found locations:', termLocations);
            console.log('[Hash Navigation] Selected location:', selectedLocation);
          }
        } else {
          // Index lookup failed - try DOM lookup as fallback
          const element = document.getElementById(termId);
          if (element) {
            // Find which state section contains this element
            const stateSection = element.closest('section[id]');
            if (stateSection) {
              const stateId = stateSection.id;
              const stateName = states.find(state => 
                generateTermId(state.name) === stateId
              )?.name;
              
              if (stateName) {
                selectedLocation = {
                  stateName,
                  letter: termId.replace('term-', '')[0]?.toUpperCase() || '',
                };
                
                if (import.meta.env.DEV && termId === 'term-agave') {
                  console.log('[Hash Navigation] Fallback: Found via DOM lookup');
                  console.log('[Hash Navigation] Fallback location:', selectedLocation);
                }
              }
            }
          }
          
          if (import.meta.env.DEV && termId === 'term-agave') {
            const elementAfterFallback = document.getElementById(termId);
            console.log('[Hash Navigation] Element exists after fallback:', !!elementAfterFallback);
          }
        }
        
        if (selectedLocation) {
          const targetStateName = selectedLocation.stateName;
          
          // Always ensure the state is expanded before scrolling
          // Check if state is not expanded, and expand if needed
          const needsExpansion = !expandedStates.has(targetStateName);
          
          if (needsExpansion) {
            setExpandedStates(prev => new Set([...prev, targetStateName]));
          }
          
          // Wait for expansion to complete before scrolling (if expansion was needed)
          // Use requestAnimationFrame to ensure DOM has updated
          const scrollDelay = needsExpansion ? 2 : 1; // Extra frame if we expanded
          let frameCount = 0;
          const doScroll = () => {
            frameCount++;
            if (frameCount < scrollDelay) {
              requestAnimationFrame(doScroll);
              return;
            }
            
            // Use reliable hash scrolling with retry logic
            scrollToHash({
              hash: termId,
              onElementFound: (element) => {
                // Dev-only check: verify ID match
                if (import.meta.env.DEV) {
                  const expectedId = termId;
                  const actualId = element.id;
                  if (expectedId !== actualId) {
                    console.warn(`[Hash Scroll] ID mismatch! Expected: ${expectedId}, Actual: ${actualId}`);
                  } else {
                    console.log(`[Hash Scroll] Successfully found element with ID: ${actualId}`);
                  }
                  
                  if (termId === 'term-agave') {
                    console.log('[Hash Scroll] term-agave element found:', element);
                    console.log('[Hash Scroll] Element parent section:', element.closest('section[id]')?.id);
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
          };
          
          requestAnimationFrame(doScroll);
        }
        // If term not found, fail gracefully (do nothing)
      } else {
        // Handle non-term hashes (like state sections)
        // Support both formats: #massachusetts and #states/massachusetts (for backward compatibility)
        let stateSlug = hash;
        if (hash.startsWith('states/')) {
          stateSlug = hash.replace('states/', '');
        }
        
        // Find the matching state by comparing slug to generateTermId(state.name)
        const matchingState = states.find(state => 
          generateTermId(state.name) === stateSlug
        );
        
        if (matchingState) {
          const targetStateName = matchingState.name;
          const stateId = generateTermId(targetStateName);
          
          // Always ensure the state is expanded before scrolling
          const needsExpansion = !expandedStates.has(targetStateName);
          
          if (needsExpansion) {
            setExpandedStates(prev => new Set([...prev, targetStateName]));
          }
          
          // Wait for expansion to complete before scrolling (if expansion was needed)
          const scrollDelay = needsExpansion ? 2 : 1;
          let frameCount = 0;
          const doScroll = () => {
            frameCount++;
            if (frameCount < scrollDelay) {
              requestAnimationFrame(doScroll);
              return;
            }
            
            // Scroll to the state section by its ID
            scrollToHash({
              hash: stateId,
              onElementFound: (element) => {
                // State section found and scrolled to
                if (import.meta.env.DEV) {
                  console.log(`[Hash Scroll] Successfully scrolled to state section: ${targetStateName}`);
                }
              },
            });
          };
          
          requestAnimationFrame(doScroll);
        } else {
          // Fallback: try direct element lookup (for other hash targets)
          const element = document.getElementById(hash);
          if (element) {
            const stateSection = element.closest('section');
            if (stateSection) {
              const stateName = states.find(state => 
                generateTermId(state.name) === stateSection.id
              )?.name;
              if (stateName) {
                setExpandedStates(prev => new Set([...prev, stateName]));
                // Wait for expansion before scrolling
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    scrollToHash({ hash });
                  });
                });
              } else {
                scrollToHash({ hash });
              }
            } else {
              scrollToHash({ hash });
            }
          }
        }
      }
      // Early return - hash navigation takes precedence
      return;
    }

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
  }, [location, termIndex]);

  // Handle hashchange events (when hash changes without page navigation)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const hash = window.location.hash.slice(1);
        
        if (hash.startsWith('term-')) {
          const termId = hash;
          
          // DEV-only logging for term-agave debugging
          if (import.meta.env.DEV && termId === 'term-agave') {
            console.log('[HashChange] Processing term-agave');
          }
          
          // O(1) lookup in term index (now returns array)
          const termLocations = termIndex.get(termId);
          
          let selectedLocation: { stateName: string; letter: string } | null = null;
          
          if (termLocations && termLocations.length > 0) {
            // If multiple states have this term, prefer the first one (stable deterministic choice)
            selectedLocation = termLocations[0];
          } else {
            // Index lookup failed - try DOM lookup as fallback
            const element = document.getElementById(termId);
            if (element) {
              // Find which state section contains this element
              const stateSection = element.closest('section[id]');
              if (stateSection) {
                const stateId = stateSection.id;
                const stateName = states.find(state => 
                  generateTermId(state.name) === stateId
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
          
          if (selectedLocation) {
            const targetStateName = selectedLocation.stateName;
            
            // Always ensure the state is expanded before scrolling
            // Check if state is not expanded, and expand if needed
            // Note: We need to check expandedStates from the closure, but since this is in a useEffect,
            // we'll use a functional update to check current state
            setExpandedStates(prev => {
              const needsExpansion = !prev.has(targetStateName);
              if (needsExpansion) {
                return new Set([...prev, targetStateName]);
              }
              return prev;
            });
            
            // Wait for expansion to complete before scrolling
            // Use requestAnimationFrame to ensure DOM has updated
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
          // Handle non-term hashes (like state sections)
          // Support both formats: #massachusetts and #states/massachusetts (for backward compatibility)
          let stateSlug = hash;
          if (hash.startsWith('states/')) {
            stateSlug = hash.replace('states/', '');
          }
          
          // Find the matching state by comparing slug to generateTermId(state.name)
          const matchingState = states.find(state => 
            generateTermId(state.name) === stateSlug
          );
          
          if (matchingState) {
            const targetStateName = matchingState.name;
            const stateId = generateTermId(targetStateName);
            
            // Always ensure the state is expanded before scrolling
            setExpandedStates(prev => {
              const needsExpansion = !prev.has(targetStateName);
              if (needsExpansion) {
                return new Set([...prev, targetStateName]);
              }
              return prev;
            });
            
            // Wait for expansion to complete before scrolling
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                scrollToHash({
                  hash: stateId,
                  onElementFound: (element) => {
                    // State section found and scrolled to
                    if (import.meta.env.DEV) {
                      console.log(`[HashChange] Successfully scrolled to state section: ${targetStateName}`);
                    }
                  },
                });
              });
            });
          } else {
            // Fallback: try direct element lookup (for other hash targets)
            scrollToHash({ hash });
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [termIndex]);

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