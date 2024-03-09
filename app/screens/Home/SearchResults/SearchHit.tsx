import ImgixImage from '~/components/ImgixImage';
import { Link } from '~/framework';

import styles from './styles.module.css';

import type { CourseHit } from '~/types/Search';

interface Props {
  hit: CourseHit;
}

export default function SearchHit({ hit }: Props) {
  const courseSlug = hit.OpenClassroomsUrl.split('/courses/')[1];

  return (
    <Link
      to={'/courses/' + courseSlug}
      className={styles.hit}
      /* @ts-ignore */
      style={{ '--category-color': hit.category.color }}
    >
      <ImgixImage src={hit.illustration} alt="" width={400} />

      <span
        className={styles.hitCategory}
        dangerouslySetInnerHTML={{
          __html: hit.category.name.replaceAll(' &', '<br /> &'),
        }}
      />

      <div className={styles.hitTitle}>
        <div>{hit.title}</div>
      </div>
    </Link>
  );
}
