/**
 * Reliable hash-anchor scrolling utility
 * Handles URL decoding, element finding with retries, and smooth scrolling
 */

interface ScrollToHashOptions {
  hash: string;
  navbarHeight?: number;
  padding?: number;
  maxRetries?: number;
  retryInterval?: number;
  onElementFound?: (element: HTMLElement) => void;
}

/**
 * Scrolls to an element identified by hash, with retry logic for async-rendered content
 */
export function scrollToHash({
  hash,
  navbarHeight = 64,
  padding = 24,
  maxRetries = 60, // 60 * 50ms = 3 seconds max
  retryInterval = 50,
  onElementFound,
}: ScrollToHashOptions): void {
  if (!hash) return;

  // Decode the hash (handle URL encoding)
  const decodedHash = decodeURIComponent(hash);
  const elementId = decodedHash.startsWith('#') ? decodedHash.slice(1) : decodedHash;

  if (!elementId) return;

  // Try to find element immediately
  let element = document.getElementById(elementId);
  
  if (element) {
    scrollToElement(element, navbarHeight, padding);
    onElementFound?.(element);
    return;
  }

  // Element not found - reset scroll to top before retries to prevent staying at restored position
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  // Element not found - use MutationObserver + interval retry
  let retryCount = 0;
  let found = false;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let observer: MutationObserver | null = null;

  const attemptScroll = () => {
    if (found) return;
    
    element = document.getElementById(elementId);
    if (element) {
      found = true;
      if (observer) observer.disconnect();
      if (intervalId) clearInterval(intervalId);
      scrollToElement(element, navbarHeight, padding);
      onElementFound?.(element);
    } else {
      retryCount++;
      if (retryCount >= maxRetries) {
        if (observer) observer.disconnect();
        if (intervalId) clearInterval(intervalId);
      }
    }
  };

  // Use MutationObserver to detect when element appears
  observer = new MutationObserver(attemptScroll);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Fallback interval retry
  intervalId = setInterval(attemptScroll, retryInterval);
}

/**
 * Scrolls an element into view with proper offset
 */
function scrollToElement(
  element: HTMLElement,
  navbarHeight: number,
  padding: number
): void {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - padding;

  window.scrollTo({
    top: offsetPosition,
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
): void {
  if (!hash) return;

  // Small delay to ensure DOM is ready
  requestAnimationFrame(() => {
    scrollToHash({
      hash,
      ...options,
    });
  });
}

