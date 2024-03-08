const TOKEN_CACHE_DELAY_SECONDS = 5;
const CONTENT_CACHE_DELAY_SECONDS = 60 * 60 * 24;

export interface ApiResultCourseToc {
  id: number;
  slug: string;
  title: string;
  type: string;
  children: ApiResultCourseToc[];
}

export interface ApiResultCourse {
  illustration: string;
  shortDescription: string;
  teaser: string;
  title: string;
  category: string;
  categoryColor: string;
  difficulty: string;
}

export interface ApiResultChapter {
  id: number;
  title: string;
}

interface ApiError {
  code: string;
  message: string;
  hint: string;
}

interface ApiResponseError {
  errors: ApiError[];
}

const cfAccessId = '49ab73f9123d1d8fffbd74a8abf81e70.access';
const cfAccessSecret =
  'bdb45105bc2b049a637efb1cf2478c6f8942a22dc85a1e5e892e19c683bfd5fb';
const clientId = 'tSISbls7y4Pr4e623LCyjgf2';
const clientSecret = 'X1QC3v80NPFSFvBGPEiUlYHD4gkYQv';
const host = 'https://api-preprod.openclassrooms.tech';

let cachedToken: any;

async function getApiToken() {
  if (!cachedToken) {
    const scopeAsNum = 24;
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const url = `${host}/oauth2/token`;
    const grantType = 'client_credentials';

    console.log('Token not cached, fetching new one');

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify({
        grant_type: grantType,
        scope: 'learning_content openclassrooms_client',
      }),
      // @ts-ignore
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basic}`,
        'CF-Access-Client-Id': cfAccessId,
        'CF-Access-Client-Secret': cfAccessSecret,
      },
      cache: 'no-cache',
      // next: {
      //   revalidate: TOKEN_CACHE_DELAY_SECONDS,
      // },
    });

    const json = await response.json();

    cachedToken = {
      host,
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresIn: json.expires_in,
      scope: scopeAsNum,
      grantType,
      clientId,
      clientSecret,
    };
  }
  return cachedToken;
}

async function apiCall(
  urlPath: string,
  { type }: { type: 'json' | 'text' } = { type: 'json' }
) {
  const { accessToken, host } = await getApiToken();

  const authHeaders = {
    Authorization: 'Bearer ' + accessToken,
    'CF-Access-Client-Id': cfAccessId,
    'CF-Access-Client-Secret': cfAccessSecret,
  };

  const apiUrl = host + urlPath;

  console.log('fetching:', apiUrl);

  const headers = {
    ...authHeaders,
    Accept: type === 'text' ? 'text/html' : 'application/json',

    ...(type === 'json' && { 'Content-Type': 'application/json' }),
    'Accept-Language': 'en',
    'X-Requested-With': 'XMLHttpRequest',
  };

  // console.log('   headers:', headers);

  try {
    const a = await fetch(apiUrl, {
      // @ts-ignore
      headers,
      // // cache: 'no-cache',
      // next: {
      //   revalidate: CONTENT_CACHE_DELAY_SECONDS,
      // },
    });

    const result = type === 'text' ? await a.text() : await a.json();
    let errors;

    if (result.errors) {
      errors = result.errors;
    }

    // if (result.match(/\{"errors":\[\{/)) {
    //   const e = JSON.parse(result);
    //   errors = e[0];
    // }

    if (errors) {
      throw new Error(`${errors[0].message} (${errors[0].hint})`);
    }

    return result;
  } catch (e: any) {
    console.log('❌ error fetching:', apiUrl);
    console.log('   fetching error: ', e.message);
    // console.log('   headers:', headers);
    throw e;
  }
}

async function getCourseIntroductionHtml(courseId: number): Promise<string> {
  return apiCall('/courses/' + courseId + '/introduction', { type: 'text' });
}

async function getCourseChapterHtml(courseId: number, chapterId: number) {
  return apiCall(
    '/courses/' + courseId + '/chapters/' + chapterId + '/content',
    { type: 'text' }
  );
}

async function getCourseToc(courseId: number): Promise<ApiResultCourseToc> {
  return apiCall('/courses/' + courseId + '/table-of-content');
}

async function getCourse(courseId: number): Promise<ApiResultCourse> {
  return apiCall('/courses/' + courseId);
}

async function getChapter(
  courseId: number,
  chapterId: number
): Promise<ApiResultChapter> {
  return apiCall('/courses/' + courseId + '/chapters/' + chapterId);
}

const api = {
  getCourse,
  getChapter,
  getCourseIntroductionHtml,
  getCourseChapterHtml,
  getCourseToc,
};

export default api;
