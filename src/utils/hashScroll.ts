/**
 * Reliable hash-anchor scrolling utility
 * Handles URL decoding, element finding with retries, and smooth scrolling.
 * Waits for a usable layout box before scrolling (collapsed accordion content
 * can exist in the DOM with zero height).
 */

interface ScrollToHashOptions {
  hash: string;
  navbarHeight?: number;
  padding?: number;
  maxRetries?: number;
  retryInterval?: number;
  /** When true (default), wait until the element has non-zero layout dimensions */
  requireLayout?: boolean;
  onElementFound?: (element: HTMLElement) => void;
  onGiveUp?: () => void;
}

/**
 * Returns true when the element has a usable layout box (not collapsed/clipped to 0).
 */
export function isElementLaidOut(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Scrolls to an element identified by hash, with retry logic for async-rendered content.
 * Returns a cancel function to stop retries (e.g. on unmount or new navigation).
 */
export function scrollToHash({
  hash,
  navbarHeight = 64,
  padding = 24,
  maxRetries = 60, // 60 * 50ms = 3 seconds max
  retryInterval = 50,
  requireLayout = true,
  onElementFound,
  onGiveUp,
}: ScrollToHashOptions): () => void {
  if (!hash) return () => {};

  // Decode the hash (handle URL encoding)
  const decodedHash = decodeURIComponent(hash);
  const elementId = decodedHash.startsWith('#') ? decodedHash.slice(1) : decodedHash;

  if (!elementId) return () => {};

  let cancelled = false;
  let retryCount = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let observer: MutationObserver | null = null;

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const cancel = () => {
    cancelled = true;
    cleanup();
  };

  const tryScroll = (): boolean => {
    if (cancelled) return true;

    const element = document.getElementById(elementId);
    if (!element) return false;

    if (requireLayout && !isElementLaidOut(element)) {
      return false;
    }

    cleanup();
    scrollToElement(element, navbarHeight, padding);
    onElementFound?.(element);
    return true;
  };

  // Immediate attempt — only succeeds if element exists and (optionally) is laid out
  if (tryScroll()) {
    return cancel;
  }

  // Not ready yet — retry without resetting scroll position
  const attemptScroll = () => {
    if (cancelled) return;

    if (tryScroll()) {
      return;
    }

    retryCount++;
    if (retryCount >= maxRetries) {
      cleanup();
      onGiveUp?.();
    }
  };

  observer = new MutationObserver(attemptScroll);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style'],
  });

  intervalId = setInterval(attemptScroll, retryInterval);

  return cancel;
}

/**
 * Scrolls an element into view with proper offset for the fixed navbar
 */
function scrollToElement(
  element: HTMLElement,
  navbarHeight: number,
  padding: number
): void {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - padding;

  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: 'smooth',
  });
}

/**
 * Hook-like function to handle hash scrolling on mount and hashchange
 * Call this in a useEffect with location.hash as dependency
 */
export function handleHashScroll(
  hash: string | null,
  options?: Omit<ScrollToHashOptions, 'hash'>
): () => void {
  if (!hash) return () => {};

  return scrollToHash({
    hash,
    ...options,
  });
}
