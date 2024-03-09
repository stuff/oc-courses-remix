// import { useParams } from 'next/navigation';
import { IconType } from 'react-icons';

import { useParams } from '~/framework';
import type { ApiResultCourseToc } from '~/lib/api';
// import { useBurgerMenu } from '@/contexts/burgerMenuContext';

import TocItem from './TocItem';

export default function TocPartItem({
  content,
  courseSlug,
  icon,
  indent,
}: {
  content: ApiResultCourseToc;
  courseSlug: string;
  icon?: IconType;
  indent?: boolean;
}) {
  // const { closeBurgerMenu } = useBurgerMenu();
  // const { courseIdSlug, chapterIdSlug } = useParams();
  // const [chapterId] = String(chapterIdSlug).split('-');
  // const isCurrent = Number(chapterId) === content.id;

  const params = useParams();
  const isCurrent = params.chapterSlug?.endsWith(content.slug);

  return (
    <TocItem
      href={`/courses/${courseSlug}/${content.id}-${content.slug}`}
      // onClick={closeBurgerMenu}
      isCurrent={isCurrent}
      icon={icon}
      indent={indent}
    >
      {content.title}
    </TocItem>
  );
}
