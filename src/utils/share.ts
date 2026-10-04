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

export function buildTermUrl(term: Term, context: string, baseUrl = 'https://talklikealocal.org'): string {
  const termId = generateTermCardId(term.word);
  return `${baseUrl}${context === 'Cultural Terms' ? '/cultural-terms' : ''}#${termId}`;
}

export async function shareTerm({ term, context, baseUrl = 'https://talklikealocal.org' }: ShareData): Promise<boolean> {
  try {
    const shareUrl = buildTermUrl(term, context, baseUrl);
    // Put URL in the text body so OS share sheets don't concatenate
    // separate `text` and `url` fields without a separator.
    const shareText = [
      `${term.word} (${term.phonetic})${term.description ? ` - ${term.description}` : ''}`,
      `From ${context} on Talk Like a Local`,
      '',
      shareUrl,
    ].join('\n');

    // Try Web Share API if available (works on mobile and some desktop browsers)
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: `Discover ${term.word} on Talk Like a Local`,
          text: shareText,
        });
        return true;
      } catch (shareError: any) {
        // User cancelled sharing
        if (shareError.name === 'AbortError') {
          return false;
        }
        
        // Permission denied or security error - return false so UI can handle fallback
        if (shareError.name === 'SecurityError' || 
            shareError.name === 'NotAllowedError' || 
            shareError.message.includes('Permission denied')) {
          return false;
        }
        
        // Re-throw unexpected errors
        throw shareError;
      }
    }

    // Web Share API not available - return false so UI can show fallback menu
    return false;
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
}

export async function copyTermLink({ term, context, baseUrl = 'https://talklikealocal.org' }: ShareData): Promise<boolean> {
  try {
    const shareUrl = buildTermUrl(term, context, baseUrl);
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error('Error copying link:', error);
    return false;
  }
}
