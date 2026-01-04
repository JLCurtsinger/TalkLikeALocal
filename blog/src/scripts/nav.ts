// nav.ts - Progressive enhancement for blog navigation
// Mirrors the behavior of the main site's navigation

type Theme = 'light' | 'dark'

class BlogNavigation {
  private isMenuOpen = false
  private theme: Theme = 'light'
  private menuToggle: HTMLElement | null = null
  private mobileMenu: HTMLElement | null = null
  private menuIcon: HTMLElement | null = null
  private themeToggle: HTMLElement | null = null
  private themeIcon: HTMLElement | null = null
  private suggestionButton: HTMLElement | null = null
  private mobileSuggestionButton: HTMLElement | null = null
  private disputeButton: HTMLElement | null = null

  constructor() {
    this.init()
  }

  private init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup())
    } else {
      this.setup()
    }
  }

  private setup() {
    // Get DOM elements
    this.menuToggle = document.getElementById('menu-toggle')
    this.mobileMenu = document.getElementById('mobile-menu')
    this.menuIcon = document.getElementById('menu-icon')
    this.themeToggle = document.getElementById('theme-toggle')
    this.themeIcon = document.getElementById('theme-icon')
    this.suggestionButton = document.getElementById('suggestion-button')
    this.mobileSuggestionButton = document.getElementById(
      'mobile-suggestion-button'
    )
    this.disputeButton = document.getElementById('dispute-button')

    // Initialize theme
    this.initTheme()

    // Setup event listeners
    this.setupEventListeners()

    console.log('Blog navigation initialized')
  }

  private initTheme() {
    // Get saved theme from localStorage (same key as main site)
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      this.theme = savedTheme
    } else {
      // Check system preference
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    this.applyTheme()
  }

  private applyTheme() {
    // Apply theme to document (same as main site)
    document.documentElement.classList.toggle('dark', this.theme === 'dark')

    // Update theme icon
    if (this.themeIcon && this.themeToggle) {
      if (this.theme === 'light') {
        // Show moon icon
        this.themeIcon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>'
        this.themeToggle.setAttribute('aria-label', 'Switch to dark mode')
      } else {
        // Show sun icon
        this.themeIcon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>'
        this.themeToggle.setAttribute('aria-label', 'Switch to light mode')
      }
    }

    // Save to localStorage (same key as main site)
    localStorage.setItem('theme', this.theme)
  }

  private setupEventListeners() {
    // Menu toggle
    this.menuToggle?.addEventListener('click', () => this.toggleMenu())

    // Theme toggle
    this.themeToggle?.addEventListener('click', () => this.toggleTheme())

    // Suggestion buttons
    this.suggestionButton?.addEventListener('click', () =>
      this.handleSuggestionClick()
    )
    this.mobileSuggestionButton?.addEventListener('click', () =>
      this.handleSuggestionClick()
    )

    // Dispute button
    this.disputeButton?.addEventListener('click', () =>
      this.handleDisputeClick()
    )

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (
        this.isMenuOpen &&
        this.mobileMenu &&
        !this.mobileMenu.contains(e.target as Node) &&
        !this.menuToggle?.contains(e.target as Node)
      ) {
        this.closeMenu()
      }
    })

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu()
      }
    })

    // Close menu on route change (for SPA-like behavior)
    window.addEventListener('beforeunload', () => {
      this.closeMenu()
    })
  }

  private toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }

  private openMenu() {
    this.isMenuOpen = true
    if (this.mobileMenu) {
      this.mobileMenu.classList.remove('translate-x-full')
      this.mobileMenu.classList.add('translate-x-0')
    }
    if (this.menuIcon) {
      // Change to X icon
      this.menuIcon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
    }
  }

  private closeMenu() {
    this.isMenuOpen = false
    if (this.mobileMenu) {
      this.mobileMenu.classList.remove('translate-x-0')
      this.mobileMenu.classList.add('translate-x-full')
    }
    if (this.menuIcon) {
      // Change to hamburger icon
      this.menuIcon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>'
    }
  }

  private toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    this.applyTheme()
  }

  private handleSuggestionClick() {
    this.closeMenu()
    // Scroll to suggestions section on main site
    window.location.href = '/#suggestions'
  }

  private handleDisputeClick() {
    this.closeMenu()
    // For now, just show an alert. In the future, this could open a modal or redirect
    alert(
      'Dispute functionality will be available soon. Please contact us at support@talklikealocal.org for now.'
    )
  }
}

// Initialize navigation when script loads
new BlogNavigation()
