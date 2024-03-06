import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Outlet } from '@remix-run/react';

import api, { ApiResultCourse, ApiResultCourseToc } from '~/lib/api';

import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ params }: LoaderFunctionArgs) {
  const courseId = Number(params.courseSlug?.split('-')[0]);
  const promises: [Promise<ApiResultCourse>, Promise<ApiResultCourseToc>] = [
    api.getCourse(courseId),
    api.getCourseToc(courseId),
  ];
  const [course, toc] = await Promise.all(promises);

  return json({ course, toc });
}

export default function Contact() {
  const { course, toc } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Courses</h1>
      <Outlet />
    </div>
  );
}
