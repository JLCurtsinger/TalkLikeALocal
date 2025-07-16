import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { DisputeForm } from './DisputeForm';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDisputeFormOpen, setIsDisputeFormOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSuggestionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    const scrollToSuggestions = () => {
      const suggestionsSection = document.getElementById('suggestions');
      if (suggestionsSection) {
        const navbarHeight = 64; // Fixed navbar height
        const extraPadding = 24; // Additional padding for visual comfort
        const elementPosition = suggestionsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - extraPadding;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      try {
        // Navigate to home page with state
        navigate('/', { 
          state: { scrollToSuggestions: true },
          replace: true 
        });
        
        // Wait for navigation to complete before scrolling
        setTimeout(scrollToSuggestions, 100);
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback: direct navigation without state
        navigate('/');
      }
    } else {
      // Already on home page, just scroll
      scrollToSuggestions();
    }
  };

  const handleDisputeClick = () => {
    setIsDisputeFormOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a 
              href="/"
              onClick={handleLogoClick}
              className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              <MapPin className="w-6 h-6 text-blue-500" />
              <span>TalkLikeALocal</span>
            </a>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Make a Suggestion button - visible on larger screens */}
              <button
                onClick={handleSuggestionClick}
                className="hidden md:inline-flex items-center px-3 py-1.5 text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              >
                Make a Suggestion
              </button>

              {/* Hamburger menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - positioned below the navbar */}
        <div
          className={`fixed right-0 top-16 w-64 bg-white dark:bg-gray-900 shadow-lg rounded-bl-lg transition-transform duration-200 z-40 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 space-y-4">
            {/* Conditional navigation links based on current page */}
            {location.pathname === '/' && (
              <Link
                to="/cultural-terms"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cultural Terms
              </Link>
            )}
            {location.pathname === '/cultural-terms' && (
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Local Terms
              </Link>
            )}
            {location.pathname !== '/' && location.pathname !== '/cultural-terms' && (
              <>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Local Terms
                </Link>
                <Link
                  to="/cultural-terms"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cultural Terms
                </Link>
              </>
            )}

            {/* Mobile-only suggestion button */}
            <button
              onClick={handleSuggestionClick}
              className="md:hidden w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Make a Suggestion
            </button>

            <button
              onClick={handleDisputeClick}
              className="w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Dispute a Term
            </button>

            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/impact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Our Impact
            </Link>
          </div>
        </div>
      </nav>

      <DisputeForm
        isOpen={isDisputeFormOpen}
        onClose={() => setIsDisputeFormOpen(false)}
      />
    </>
  );
}