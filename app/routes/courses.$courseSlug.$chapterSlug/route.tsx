import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import api from '~/lib/api';
import { cleanClaireHtml } from '~/lib/cleanClaireHtml';
import { retrieveCachedHtmlContent } from '~/lib/retrieveCachedHtmlContent';
import CourseContent from '~/components/CourseContent';

import type { LoaderFunctionArgs } from '@remix-run/node';
import type { ApiResultChapter } from '~/lib/api';

export async function loader({ params }: LoaderFunctionArgs) {
  const courseId = Number(params.courseSlug?.split('-')[0]);
  const chapterId = Number(params.chapterSlug?.split('-')[0]);
  const cacheKey = 'course-chapter-' + courseId + '-' + chapterId;

  const promises: [Promise<ApiResultChapter>, Promise<string>] = [
    api.getChapter(courseId, chapterId),
    retrieveCachedHtmlContent(
      cacheKey,
      () => api.getCourseChapterHtml(Number(courseId), Number(chapterId)),
      { htmlProcessFunction: cleanClaireHtml }
    ),
  ];
  const [chapter, chapterHtml] = await Promise.all(promises);

  return json({
    chapter,
    chapterHtml: `<h2>${chapter.title}</h2>` + chapterHtml,
  });
}

export default function Chapter() {
  const { chapter, chapterHtml } = useLoaderData<typeof loader>();
  return <CourseContent>{chapterHtml}</CourseContent>;
}
