// import { useEffect, useState } from 'react';

// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
import cx from 'classnames';
import { Link, useParams } from '~/framework';
import ImgixImage from '~/components/ImgixImage';
import TocPart from './TocPart';
import TocItem from './TocItem';
// import TocIntroductionItem from './TocIntroductionItem';

import type { ApiResultCourseToc } from '~/lib/api';
// import { useBurgerMenu } from '@/contexts/burgerMenuContext';

import styles from './styles.module.css';

export default function Toc({
  content,
  image,
  courseSlug,
}: {
  content: ApiResultCourseToc;
  image: string;
  courseSlug: string;
}) {
  const params = useParams();
  const isCurrent = params.chapterSlug === undefined;
  return (
    <nav className={styles.toc}>
      <TocItem href={`/courses/${courseSlug}`} isCurrent={isCurrent}>
        <div className={styles.tocIntro}>
          <ImgixImage src={image} width={240} />
          <span>Introduction</span>
        </div>
      </TocItem>
      {content.children.map((child) => (
        <TocPart key={child.id} courseSlug={courseSlug} content={child} />
      ))}
    </nav>
  );
  // const [container, setContainer] = useState<HTMLElement | null>(null);
  // const { isOpen } = useBurgerMenu();
  // const theme = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.up('xl'));

  // useEffect(() => {
  //   setContainer(document.getElementById('color-container-wrapper'));
  // }, [setContainer]);

  // if (!container) {
  //   return null;
  // }

  // return (
  //   <Drawer
  //     container={container}
  //     variant={matches ? 'persistent' : 'temporary'}
  //     anchor="left"
  //     open={isOpen}
  //     sx={{
  //       width: 'var(--toc-drawer-width)',
  //       '& .MuiDrawer-paper': {
  //         boxSizing: 'border-box',
  //         width: 'var(--toc-drawer-width)',
  //         height: 'calc(100% - var(--course-header-height))',
  //         top: 'var(--course-header-height)',
  //         background: 'var(--color-local-highlite-lighter4)',
  //       },
  //     }}
  //   >
  //     <List sx={{ width: '100%', pt: 0 }} component="nav">
  //       <TocIntroductionItem label="Introduction" image={image} />
  //       {content.children.map((child) => (
  //         <TocPart key={child.id} content={child} />
  //       ))}
  //     </List>
  //   </Drawer>
  // );
}
