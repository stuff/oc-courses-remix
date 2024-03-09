// 'use client';

// import { useState } from 'react';
// import { styled } from '@mui/system';
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Collapse from '@mui/material/Collapse';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { MdFolderOpen } from 'react-icons/md';
import { MdOutlineInsertDriveFile } from 'react-icons/md';

import type { ApiResultCourseToc } from '~/lib/api';

import TocPartItem from './TocPartItem';

import styles from './styles.module.css';

// import TocQuizItem from './TocQuizItem';

// const ListItemButtonStyled = styled(ListItemButton)({
//   // '& .MuiListItemButton-root': {
//   fontWeight: 'bold',
//   background: 'var(--color-local-highlite-lighter3)',
//   '&:hover': {
//     background: 'var(--color-local-highlite-lighter4)',
//   },

//   '& .MuiTypography-root': {
//     fontWeight: 'bold',
//   },
//   // },
//   // width: 'calc(var(--toc-drawer-width) - 16px)',
// });

export default function TocPart({
  content,
  courseSlug,
}: {
  courseSlug: string;
  content: ApiResultCourseToc;
}) {
  const partTitle = content.title;
  const items = content.children;

  const filteredItems = items
    .filter((item) => item.type === 'title-2')
    .map((item) => (
      <TocPartItem
        key={item.id}
        icon={MdOutlineInsertDriveFile}
        content={item}
        courseSlug={courseSlug}
        indent
      />
    ));

  return (
    <div className={styles.tocPart}>
      <div className={styles.tocPartTitem}>
        <div>
          <span>
            <MdFolderOpen size="1.5rem" opacity={0.5} />
          </span>
          {partTitle}
        </div>
      </div>
      {filteredItems}
    </div>
  );
  // const [isOpen, setOpen] = useState(true);
  // const partTitle = content.title;
  // const items = content.children;
  // const handlePartClick = () => {
  //   setOpen(!isOpen);
  // };
  // const filteredItems = items
  //   .filter((item) => item.type === 'title-2')
  //   .map((item) => <TocPartItem key={item.id} content={item} />);
  // return (
  //   <>
  //     <ListItemButtonStyled onClick={handlePartClick}>
  //       <ListItemIcon>
  //         <FolderOpenOutlinedIcon />
  //       </ListItemIcon>
  //       <ListItemText primary={partTitle} />
  //       {isOpen ? <ExpandLess /> : <ExpandMore />}
  //     </ListItemButtonStyled>
  //     <Collapse in={isOpen} timeout="auto">
  //       <List component="div" disablePadding>
  //         {filteredItems}
  //         <TocQuizItem part={content} />
  //       </List>
  //     </Collapse>
  //   </>
  // );
}
