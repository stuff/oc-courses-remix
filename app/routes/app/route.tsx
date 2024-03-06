import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Outlet } from '@remix-run/react';

import api, { ApiResultCourse, ApiResultCourseToc } from '~/lib/api';

import type { LoaderFunctionArgs } from '@remix-run/node';

export default function Contact() {
  return (
    <div>
      pouet
      <Outlet />
    </div>
  );
}
