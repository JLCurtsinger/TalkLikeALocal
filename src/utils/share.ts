import { Term } from '../types';

interface ShareData {
  term: Term;
  context: string;
  baseUrl?: string;
}

export function generateTermId(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateTermCardId(word: string): string {
  const slug = generateTermId(word);
  return `term-${slug}`;
}

export async function shareTerm({ term, context, baseUrl = 'https://talklikealocal.org' }: ShareData): Promise<boolean> {
  try {
    const termId = generateTermCardId(term.word);
    const shareText = `${term.word} (${term.phonetic})${term.description ? ` - ${term.description}` : ''}\nFrom ${context} on Talk Like a Local`;
    const shareUrl = `${baseUrl}${context === 'Cultural Terms' ? '/cultural-terms' : ''}#${termId}`;

    // Check if we're on mobile and Web Share API is available
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: `Discover ${term.word} on Talk Like a Local`,
          text: shareText,
          url: shareUrl,
        });
        return true;
      } catch (shareError: any) {
        // User cancelled sharing
        if (shareError.name === 'AbortError') {
          return false;
        }
        
        // Permission denied or security error - fall back to clipboard
        if (shareError.name === 'SecurityError' || 
            shareError.name === 'NotAllowedError' || 
            shareError.message.includes('Permission denied')) {
          console.warn('Share API not available or permission denied, falling back to clipboard');
          await navigator.clipboard.writeText(shareUrl);
          return true;
        }
        
        // Re-throw unexpected errors
        throw shareError;
      }
    }

    // Default behavior: copy link to clipboard (desktop and mobile fallback)
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
}