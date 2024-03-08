import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Outlet } from '@remix-run/react';
import { useParams, useOutlet } from '@remix-run/react';
import tinycolor from 'tinycolor2';

import api from '~/lib/api';
import { cleanClaireHtml } from '~/lib/cleanClaireHtml';
import { retrieveCachedHtmlContent } from '~/lib/retrieveCachedHtmlContent';
import CourseContent from '~/components/CourseContent';
import staticImgToImgix from '~/lib/staticImgToImgix';

import Toc from './components/Toc';
import styles from './styles.module.css';

import type { LoaderFunctionArgs } from '@remix-run/node';
import type { ApiResultCourse, ApiResultCourseToc } from '~/lib/api';

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

  return json({ course, toc, introduction });
}

export default function Course() {
  const { course, toc, introduction } = useLoaderData<typeof loader>();
  const { courseSlug = '' } = useParams();
  const outlet = useOutlet();

  const color1 = tinycolor(course.categoryColor).setAlpha(0.8);
  const color2 = tinycolor(course.categoryColor).setAlpha(0.5);
  const color3 = tinycolor(course.categoryColor).setAlpha(0.22);
  const color4 = tinycolor(course.categoryColor).setAlpha(0.09);

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
      <h1>{course.title}</h1>
      <div className={styles.wrapper}>
        <Toc
          courseSlug={courseSlug}
          content={toc}
          image={staticImgToImgix(course.illustration, 'w=240')}
        />
        {outlet ? <Outlet /> : <CourseContent>{introduction}</CourseContent>}
      </div>
    </div>
  );
}
