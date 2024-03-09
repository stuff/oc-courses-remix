import type { BaseHit } from 'instantsearch.js';

export interface CourseHit extends BaseHit {
  id: string;
  title: string;
  illustration: string;
  category: {
    color: string;
    name: string;
  };
}
