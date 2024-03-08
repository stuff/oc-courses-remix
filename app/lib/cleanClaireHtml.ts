import hljs from 'highlight.js';

import katex from 'katex';

const VIDEO_REGEXP =
  /<video src="https:\/\/(player\.)?vimeo.com(\/.*?)?\/(\d+)(.*)">.*?<\/video>/g;

const IMAGE_REGEXP = /<img.*?\/>/g;

function parseVideoSimple(html: string) {
  const videoRegexp =
    /<video src="https:\/\/(player\.)?vimeo.com(\/video)?\/(\d+)(.*)">.*?<\/video>/g;

  return html.replace(
    videoRegexp,
    `<iframe loading="lazy" src="//player.vimeo.com/video/$1?color=7451eb" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" style="width: 720px; height: 406px;"></iframe>`
  );
}
async function parseVideo(html: string) {
  let matches;
  const thumbPromises = [];

  while ((matches = VIDEO_REGEXP.exec(html)) !== null) {
    const [str, , , videoId] = matches;
    thumbPromises.push(
      fetch(
        'https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + videoId
      )
        .then((res) => res.json())
        .then((json) => {
          html = html.replace(
            str,
            `<iframe class="video-container" style="background-size: cover;background-image:url(${json.thumbnail_url});aspect-ratio: 16 / 9.13" loading="lazy" src="//player.vimeo.com/video/${videoId}?color=7451eb" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>`
          );
        })
    );
  }

  await Promise.all(thumbPromises);

  return html;
}

export async function removeVideo(html: string) {
  let matches;
  while ((matches = VIDEO_REGEXP.exec(html)) !== null) {
    const [str] = matches;
    html = html.replace(str, '');
  }

  return html;
}

export async function removeImage(html: string) {
  let matches;
  while ((matches = IMAGE_REGEXP.exec(html)) !== null) {
    const [str] = matches;
    html = html.replace(str, '');
  }

  return html;
}

export function cleanIds(html: string) {
  return html
    .replace(/\s?data-claire-element-id=".*?"\s?/g, '')
    .replace(/\id=".*?"/g, '')
    .replace(/ >/g, '>');
}

function clearnCourseLinks(html: string) {
  return html.replace(/href="\/en\//g, 'href="/');
}

function parseImagesSimple(html: string) {
  return html.replace(
    /<img src="(https:\/\/user.oc-static.com\/)(.*?)"/g,
    '<img loading="lazy" src="https://oc-user.imgix.net/$2?auto=compress,format&q=80"'
  );
}

async function parseImages(html: string) {
  let matches;
  const thumbPromises: Promise<{
    originalHtml: string;
    newHtml: string;
  }>[] = [];

  const imageRegexp = /<img src="(https:\/\/user.oc-static.com\/)(.*?)".*?\/>/g;
  while ((matches = imageRegexp.exec(html)) !== null) {
    const originalHtml = matches[0];
    const imgixUrl = `https://oc-user.imgix.net/${matches[2]}`;
    const imgDataUrl = `${imgixUrl}?fm=json`;
    const optimizedImgUrl = `${imgixUrl}?auto=compress,format&q=80`;

    thumbPromises.push(
      new Promise(async (resolve) => {
        const response = await fetch(imgDataUrl);
        const json = await response.json();

        const a = {
          originalHtml,
          newHtml: `<img loading="lazy" width="${
            json.PixelWidth
          }" style="aspect-ratio: ${
            json.PixelWidth / json.PixelHeight
          }" src="${optimizedImgUrl}" />`,
        };
        resolve(a);
      })
    );
  }

  const a = await Promise.all(thumbPromises);

  a.forEach(({ originalHtml, newHtml }) => {
    html = html.replace(originalHtml, newHtml);
  });

  return html;
}

async function parseCode(html: string) {
  const htmlDecode = (input: string) => {
    return String(input)
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  };

  let matches;
  const codeRegexp =
    /<pre.*?code data-claire-semantic="(.*?)">([\s\S]+?)<\/code><\/pre>/gm;

  while ((matches = codeRegexp.exec(html)) !== null) {
    const htmlToReplace = matches[0];
    const code = htmlDecode(matches[2]);
    const language = matches[1];

    const hlcode = hljs.highlight(code, { language }).value;

    html = html.replace(
      htmlToReplace,
      `<pre class="hlcode theme-atom-one-dark" data-language="${language}"><div class="hljs"><code class="hlcode--block">${hlcode}</code></div></pre>`
    );
  }

  return html;
}

async function cleanWhitespace(html: string) {
  return html.replace(/ {2,}/g, ' ');
}

async function cleanTd(html: string) {
  return html.replace(/<td><p>(.*?)<\/p><\/td>/g, '<td>$1</td>');
}

async function parseMath(html: string) {
  let matches;
  const codeRegexp = /<math>\$\\[\[\(](.*?)\\[\]\)]\$<\/math>/gm;
  while ((matches = codeRegexp.exec(html)) !== null) {
    let math;
    let latex = matches[1];
    const displayMode = matches[0].includes('$\\[');
    try {
      math = katex.renderToString(latex, { displayMode });
    } catch (e) {
      // FIXME: do a better job
      latex = latex.slice(0, -1);
      math = katex.renderToString(latex, { displayMode });
    }

    html = html.replace(matches[0], math);
  }

  return html;
}

export async function cleanClaireHtml(html: string) {
  console.time('cleanClaireHtml');

  html = cleanIds(html);
  html = await parseVideo(html);
  html = clearnCourseLinks(html);
  html = await parseImages(html);
  html = await parseCode(html);
  html = await parseMath(html);
  // html = await cleanWhitespace(html);
  html = await cleanTd(html);
  console.timeEnd('cleanClaireHtml');

  return html;
}

// export async function cleanClaireHtml(html: string) {
//   console.time('cleanClaireHtml');
//   html = cleanIds(html);
//   html = parseVideoSimple(html);
//   html = clearnCourseLinks(html);
//   html = parseImagesSimple(html);
//   console.timeEnd('cleanClaireHtml');

//   return html;
// }
