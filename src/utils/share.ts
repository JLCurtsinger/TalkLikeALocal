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

export async function shareTerm({ term, context, baseUrl = 'https://talklikealocal.org' }: ShareData): Promise<boolean> {
  try {
    const termId = generateTermId(term.word);
    const shareText = `${term.word} (${term.phonetic})${term.description ? ` - ${term.description}` : ''}\nFrom ${context} on Talk Like a Local`;
    const shareUrl = `${baseUrl}${context === 'Cultural Terms' ? '/cultural-terms' : ''}#${termId}`;

    // Check if Web Share API is available and we're in a secure context
    if (navigator.share && window.isSecureContext) {
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
          await navigator.clipboard.writeText(`${shareText}\nLearn more at ${shareUrl}`);
          return true;
        }
        
        // Re-throw unexpected errors
        throw shareError;
      }
    }

    // Fallback to clipboard if Web Share API is not available
    await navigator.clipboard.writeText(`${shareText}\nLearn more at ${shareUrl}`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
}