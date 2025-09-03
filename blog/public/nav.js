// nav.js - Vanilla JS for blog navigation functionality

document.addEventListener('DOMContentLoaded', function() {
  // Theme management
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Initialize theme from localStorage or system preference
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
    updateThemeIcon(theme);
    localStorage.setItem('theme', theme);
  }
  
  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    
    if (theme === 'light') {
      // Show moon icon for light theme
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
    } else {
      // Show sun icon for dark theme
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    updateThemeIcon(newTheme);
    localStorage.setItem('theme', newTheme);
  }
  
  // Mobile menu management
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  
  function toggleMobileMenu() {
    const isOpen = !mobileMenu.classList.contains('translate-x-full');
    
    if (isOpen) {
      // Close menu
      mobileMenu.classList.add('translate-x-full');
      menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    } else {
      // Open menu
      mobileMenu.classList.remove('translate-x-full');
      menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
    }
  }
  
  function closeMobileMenu() {
    mobileMenu.classList.add('translate-x-full');
    menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
  }
  
  // Event listeners
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (mobileMenu && menuToggle && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });
  
  // Close mobile menu on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });
  
  // Close mobile menu when clicking on menu links
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function(event) {
      if (event.target.tagName === 'A') {
        closeMobileMenu();
      }
    });
  }
  
  // Initialize theme on page load
  initializeTheme();
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Only update if no saved theme preference
    if (!localStorage.getItem('theme')) {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      updateThemeIcon(theme);
    }
  });
});