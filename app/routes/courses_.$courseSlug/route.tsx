import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Outlet } from '@remix-run/react';
import { useOutlet } from '@remix-run/react';
import tinycolor from 'tinycolor2';
import { MdChevronRight } from 'react-icons/md';

import api from '~/lib/api';
import { cleanClaireHtml } from '~/lib/cleanClaireHtml';
import { retrieveCachedHtmlContent } from '~/lib/retrieveCachedHtmlContent';
import CourseContent from '~/components/CourseContent';
import Button from '~/components/Button';
import staticImgToImgix from '~/lib/staticImgToImgix';
import { Link, useParams } from '~/framework';

import Toc from './components/Toc';
import styles from './styles.module.css';

import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import type { ApiResultCourse, ApiResultCourseToc } from '~/lib/api';

export const meta: MetaFunction = ({
  data,
}: {
  data: { course: ApiResultCourse };
}) => {
  const { course } = data;

  return [
    { title: course.title + ' - OpenClassrooms' },
    {
      name: 'description',
      content: course.shortDescription,
    },
    {
      property: 'og:description',
      content: course.shortDescription,
    },
    {
      property: 'og:image',
      content: course.illustration,
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:description',
      content: course.shortDescription,
    },
    {
      property: 'twitter:image',
      content: course.illustration,
    },
    {
      tagName: 'link',
      rel: 'icon',
      href: `data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' height='32' width='32' viewBox='0 0 40 40' %3E%3Crect width='40' height='40' rx='4' fill='${encodeURIComponent(
        course.categoryColor
      )}'%3E%3C/rect%3E%3Cpath d='M31.2 20.198C31.1998 22.8174 30.4801 25.3857 29.1206 27.619C27.761 29.8522 25.8145 31.6635 23.4963 32.8525C21.1782 34.0415 18.5785 34.5618 15.9849 34.3561C13.3913 34.1504 10.9047 33.2266 8.80005 31.6868L13.5648 25.9718C14.5847 26.6037 15.7536 26.9502 16.9509 26.9755C18.1482 27.0009 19.3306 26.7042 20.376 26.116C21.4214 25.5278 22.2921 24.6695 22.8981 23.6296C23.5041 22.5896 23.8236 21.4057 23.8236 20.2C23.8236 18.9943 23.5041 17.8104 22.8981 16.7704C22.2921 15.7305 21.4214 14.8722 20.376 14.284C19.3306 13.6958 18.1482 13.3991 16.9509 13.4245C15.7536 13.4498 14.5847 13.7963 13.5648 14.4282L8.80005 8.71325C10.9047 7.17344 13.3913 6.24961 15.9849 6.04388C18.5785 5.83815 21.1782 6.35855 23.4963 7.54753C25.8145 8.7365 27.761 10.5478 29.1206 12.781C30.4801 15.0143 31.1998 17.5826 31.2 20.202V20.198Z' fill='white' %3E%3C/path%3E%3C/svg%3E`,
      type: 'image/svg',
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const courseId = Number(params.courseSlug?.split('-')[0]);
  const cacheKey = 'course-introduction-' + courseId;
  const promises: [
    Promise<ApiResultCourse>,
    Promise<ApiResultCourseToc>,
    Promise<string>
  ] = [
    api.getCourse(courseId),
    api.getCourseToc(courseId),
    retrieveCachedHtmlContent(
      cacheKey,
      () => api.getCourseIntroductionHtml(Number(courseId)),
      { htmlProcessFunction: cleanClaireHtml }
    ),
  ];
  const [course, toc, introduction] = await Promise.all(promises);

  return json({
    course,
    toc,
    introduction,
  });
}

export default function Course() {
  const { course, toc: tocData, introduction } = useLoaderData<typeof loader>();
  const { courseSlug = '' } = useParams();
  const outlet = useOutlet();

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
      {/* <h1>{course.title}</h1> */}
      <div className={styles.wrapper}>
        <Toc
          courseSlug={courseSlug}
          content={tocData}
          image={staticImgToImgix(course.illustration, 'w=240')}
        />
        <div className={styles.courseContentContainer}>
          <div className={styles.titleContainer}>
            <h1>{course.title}</h1>
          </div>
          {outlet ? (
            <Outlet />
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
