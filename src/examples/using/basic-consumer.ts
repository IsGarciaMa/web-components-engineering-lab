import './reading-card';
import type { ReadingCard } from './reading-card';

export async function configureBasicCard(card: ReadingCard): Promise<void> {
  card.setAttribute('heading', 'Lectura revisada');
  card.removeAttribute('compact');
  await card.updateComplete;
}
