import { State, Culture, Term } from '../types';
import { generateTermCardId } from './share';

/**
 * Term location information for state terms
 */
export interface StateTermLocation {
  stateName: string;
  letter: string;
}

/**
 * Term location information for culture terms
 */
export interface CultureTermLocation {
  cultureName: string;
  letter: string;
}

/**
 * Builds an index map of term IDs to their state location
 * Key: term-{slug} (e.g., "term-cholla")
 * Value: { stateName, letter }
 */
export function buildStateTermIndex(states: State[]): Map<string, StateTermLocation> {
  const index = new Map<string, StateTermLocation>();

  for (const state of states) {
    for (const term of state.terms) {
      const termId = generateTermCardId(term.word);
      const letter = term.word[0]?.toUpperCase() || '';
      
      index.set(termId, {
        stateName: state.name,
        letter,
      });
    }
  }

  return index;
}

/**
 * Builds an index map of term IDs to their culture location
 * Key: term-{slug} (e.g., "term-kwatsan")
 * Value: { cultureName, letter }
 */
export function buildCultureTermIndex(cultures: Culture[]): Map<string, CultureTermLocation> {
  const index = new Map<string, CultureTermLocation>();

  for (const culture of cultures) {
    for (const term of culture.terms) {
      const termId = generateTermCardId(term.word);
      const letter = term.word[0]?.toUpperCase() || '';
      
      index.set(termId, {
        cultureName: culture.name,
        letter,
      });
    }
  }

  return index;
}

