import { useParams } from 'next/navigation';

import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';

import TocItem from './TocItem';

import type { ApiResultCourseToc } from '@/lib/api';

export default function TocQuizItem({ part }: { part: ApiResultCourseToc }) {
  // const { closeBurgerMenu } = useBurgerMenu();
  const { courseIdSlug, partId } = useParams();
  // const [chapterId] = String(chapterIdSlug).split('-');
  // const isCurrent = Number(chapterId) === content.id;
  // console.log(courseIdSlug, partId);

  return (
    <TocItem
      href={'/courses/' + courseIdSlug + '/quiz/' + part.id}
      // onClick={closeBurgerMenu}
      isCurrent={part.id === Number(partId)}
      icon={QuizOutlinedIcon}
    >
      Quiz ✨
    </TocItem>
  );
}
