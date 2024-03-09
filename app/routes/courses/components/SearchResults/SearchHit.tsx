// import slugify from 'slugify';
// import Link from 'next/link';
// import { styled } from '@mui/system';
// import Typography from '@mui/material/Typography';

// import ImgixImage from '@/app/components/ImgixImage';
// import LoadingLink from '@/app/components/LoadingLink';

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
    /* @ts-ignore */
    <div
      className={styles.hit}
      style={{ '--category-color': hit.category.color }}
    >
      <Link to={'/courses/' + courseSlug}>
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
      {/* </HintLink> */}
    </div>
  );
}
