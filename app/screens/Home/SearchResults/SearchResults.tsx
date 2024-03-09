import { useRef, useEffect } from 'react';

// import { styled } from '@mui/system';
import { useInfiniteHits } from 'react-instantsearch';

import SearchHit from './SearchHit';

import styles from './styles.module.css';

import type { CourseHit } from '~/types/Search';

export default function SearchResults() {
  const { hits, isLastPage, showMore } = useInfiniteHits<CourseHit>();
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [isLastPage, showMore, hits.length]);

  return (
    <ul className={styles.hitContainer}>
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <SearchHit hit={hit} />
        </li>
      ))}
      <li ref={sentinelRef} aria-hidden="true" />
    </ul>
  );
}
