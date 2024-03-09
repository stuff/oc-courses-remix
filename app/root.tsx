import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react';

import PageLoaderContainer from '~/components/PageLoaderContainer';

import '@fontsource-variable/inter/wght.css';

import './global.css';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export async function loader() {
  return json({
    ENV: {
      PUBLIC_ALGOLIA_APP_ID: process.env.PUBLIC_ALGOLIA_APP_ID,
      PUBLIC_ALGOLIA_API_KEY: process.env.PUBLIC_ALGOLIA_API_KEY,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ padding: '0 16px' }}>
        <PageLoaderContainer>
          <Outlet />
        </PageLoaderContainer>
        <ScrollRestoration />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />

        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
