import { ApiResultCourseToc } from './api';

function flattenFullToc(toc: ApiResultCourseToc) {
  const flatToc: Omit<ApiResultCourseToc, 'children'>[] = [];
  const tocChildren = toc.children;
  tocChildren.forEach(({ children }) => {
    children.forEach((child) => {
      if (child.type !== 'title-2') {
        return;
      }
      flatToc.push(child);
    });
  });

  return flatToc;
}

export default function toc(rawToc: ApiResultCourseToc, basePath: string) {
  const flatToc = flattenFullToc(rawToc);

  function getPart(partId: number): ApiResultCourseToc | null {
    const tocChildren = rawToc.children;

    let part: ApiResultCourseToc | null = null;

    tocChildren.forEach((child: ApiResultCourseToc) => {
      if (child.id === partId) {
        part = child as ApiResultCourseToc;
      }
    });

    if (!part) {
      return null;
    }

    (part as ApiResultCourseToc).children = (
      part as ApiResultCourseToc
    ).children.filter((child) => child.type === 'title-2');

    return part;
  }

  function getFirstChapterOfPart(partId: number) {
    const part = getPart(partId);
    return part?.children[0];
  }

  function isLastChapterOfPart(partId: number, chapterId: number) {
    const part = getPart(partId);
    return Number(part?.children[part?.children.length - 1].id) === chapterId;
  }

  function getParentId(chapterId: number): number {
    const tocChildren = rawToc.children;
    let parentId = null;
    tocChildren.forEach(({ children }, m) => {
      children.forEach((child, n) => {
        if (child.id === chapterId) {
          parentId = tocChildren[m]?.id;
        }
      });
    });

    return parentId ?? -1;
  }

  function getNextPart(partId: number) {
    const tocChildren = rawToc.children;
    const partIndex = tocChildren.findIndex((item) => item.id === partId);
    if (partIndex === -1) {
      return null;
    }

    return tocChildren[partIndex + 1];
  }

  function getNextChapter(chapterId: number) {
    const chapterIndex = flatToc.findIndex((item) => item.id === chapterId);
    if (chapterIndex === -1) {
      return null;
    }

    // const partId = getParentId(chapterId);
    // if (isLastChapterOfPart(partId, chapterId)) {
    //   return {
    //     id: partId,
    //     type: 'quiz',
    //   } as ApiResultCourseToc;
    // }

    return flatToc[chapterIndex + 1];
  }

  function getNextUrl(nextChapter: Partial<ApiResultCourseToc>) {
    let nextUrl = nextChapter
      ? `${basePath}/${nextChapter?.id}-${nextChapter?.slug}`
      : null;

    if (nextChapter?.type === 'quiz') {
      nextUrl = `${basePath}/quiz/${nextChapter.id}`;
    }

    return nextUrl;
  }

  return {
    getPart,
    getNextItem: getNextChapter,
    getNextUrl,
    getFirstChapterOfPart,
    getNextPart,
  };
}
