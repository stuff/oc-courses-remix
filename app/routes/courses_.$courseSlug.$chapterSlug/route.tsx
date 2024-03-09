import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { MdChevronRight } from 'react-icons/md';

import api from '~/lib/api';
import tocApi from '~/lib/toc';
import { cleanClaireHtml } from '~/lib/cleanClaireHtml';
import { retrieveCachedHtmlContent } from '~/lib/retrieveCachedHtmlContent';
import CourseContent from '~/components/CourseContent';
import Button from '~/components/Button';
import { Link, useParams } from '~/framework';

import styles from './styles.module.css';

import type { ApiResultChapter, ApiResultCourseToc } from '~/lib/api';

export const meta: MetaFunction = ({
  matches,
  data,
}: {
  data: { chapter: ApiResultChapter };
}) => {
  const { chapter } = data;
  const flatMatches = matches.flatMap((match: any) => match.meta ?? []);
  const parentMeta = flatMatches.filter((meta: any) => !('title' in meta));
  const { title: parentTitle } = flatMatches.find(
    (meta: any) => 'title' in meta
  );

  const newTitle =
    chapter.title + ' (' + parentTitle.split(' - ')[0] + ') - OpenClassrooms';

  return [...parentMeta, { title: newTitle }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const courseId = Number(params.courseSlug?.split('-')[0]);
  const chapterId = Number(params.chapterSlug?.split('-')[0]);
  const cacheKey = 'course-chapter-' + courseId + '-' + chapterId;

  const promises: [
    Promise<ApiResultCourseToc>,
    Promise<ApiResultChapter>,
    Promise<string>
  ] = [
    api.getCourseToc(courseId),
    api.getChapter(courseId, chapterId),
    retrieveCachedHtmlContent(
      cacheKey,
      () => api.getCourseChapterHtml(Number(courseId), Number(chapterId)),
      { htmlProcessFunction: cleanClaireHtml }
    ),
  ];
  const [toc, chapter, chapterHtml] = await Promise.all(promises);
  console.log('***>', toc);
  return json({
    toc,
    chapter,
    chapterHtml: `<h2>${chapter.title}</h2>` + chapterHtml,
  });
}

export default function Chapter() {
  const { toc: tocData, chapterHtml } = useLoaderData<typeof loader>();
  const { chapterSlug, courseSlug = '' } = useParams();
  const toc = tocApi(tocData, `/courses/${courseSlug}`);
  const [chapterId] = chapterSlug ? chapterSlug.split('-') : [''];

  const nextChapter = toc.getNextItem(Number(chapterId));
  const nextUrl = nextChapter ? toc.getNextUrl(nextChapter) : null;

  return (
    <>
      {/* <div className={styles.courseContentContainer}> */}
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
      {/* </div> */}
    </>
  );
}
