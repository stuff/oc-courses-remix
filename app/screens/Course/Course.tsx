import tinycolor from 'tinycolor2';
import { MdChevronRight } from 'react-icons/md';

import { Link } from '~/framework';

import Button from '~/components/Button';
import CourseContent from '~/components/CourseContent';

import Toc from './Toc';

import styles from './styles.module.css';

import type { ApiResultCourse, ApiResultCourseToc } from '~/lib/api';

interface Props {
  course: ApiResultCourse;
  tocData: ApiResultCourseToc;
  introduction: string;
  courseSlug: string;
  children?: React.ReactNode;
}

export default function Course({
  course,
  tocData,
  introduction,
  courseSlug,
  children,
}: Props) {
  const color1 = tinycolor(course.categoryColor).setAlpha(0.8);
  const color2 = tinycolor(course.categoryColor).setAlpha(0.5);
  const color3 = tinycolor(course.categoryColor).setAlpha(0.22);
  const color4 = tinycolor(course.categoryColor).setAlpha(0.09);

  const firstChapter = tocData.children[0].children[0];
  const firstChapterUrl = `/courses/${courseSlug}/${firstChapter.id}-${firstChapter.slug}`;

  return (
    <div
      style={{
        /* @ts-ignore */
        '--color-local-highlite': course.categoryColor,
        '--color-local-highlite-lighter1': color1.toString(),
        '--color-local-highlite-lighter2': color2.toString(),
        '--color-local-highlite-lighter3': color3.toString(),
        '--color-local-highlite-lighter4': color4.toString(),
      }}
    >
      <div className={styles.wrapper}>
        <Toc
          courseSlug={courseSlug}
          content={tocData}
          image={course.illustration}
        />
        <div className={styles.courseContentContainer}>
          <div className={styles.titleContainer}>
            <h1>{course.title}</h1>
          </div>
          {children ? (
            children
          ) : (
            <>
              <CourseContent>{introduction}</CourseContent>
              <div className={styles.actions}>
                <div>
                  <Button
                    component={Link}
                    icon={MdChevronRight}
                    to={firstChapterUrl}
                  >
                    Start course
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
