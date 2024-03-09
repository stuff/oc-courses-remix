import { MdChevronRight } from 'react-icons/md';

import { Link } from '~/framework';

import Button from '~/components/Button';
import CourseContent from '~/components/CourseContent';

import styles from './styles.module.css';

interface Props {
  nextUrl: string | null;
  chapterHtml: string;
}

export default function Chapter({ nextUrl, chapterHtml }: Props) {
  return (
    <>
      <CourseContent>{chapterHtml}</CourseContent>

      {nextUrl && (
        <div className={styles.actions}>
          <div>
            <Button component={Link} to={nextUrl} icon={MdChevronRight}>
              Continue reading
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
