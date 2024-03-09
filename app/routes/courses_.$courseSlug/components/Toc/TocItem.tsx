// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

// import LoadingLink from '@/app/components/LoadingLink';
// import React from 'react';

import cx from 'classnames';

import { Link } from '~/framework';

import styles from './styles.module.css';
import type { IconType } from 'react-icons';

export default function TocItem({
  isCurrent,
  href,
  children,
  onClick = () => {},
  icon: Icon,
  indent,
}: // component = LoadingLink,
// icon: Icon = InsertDriveFileOutlinedIcon,
{
  onClick?: () => void;
  isCurrent?: boolean;
  component?: React.ElementType;
  href: string;
  icon?: IconType;
  children: React.ReactNode;
  indent?: boolean;
}) {
  return (
    <div className={cx(styles.tocItem, { [styles.currentItem]: isCurrent })}>
      <Link to={href} style={indent ? { paddingLeft: '32px' } : {}}>
        {Icon && (
          <span>
            <Icon size="1.5rem" opacity={indent ? 0.25 : 0.5} />
          </span>
        )}

        {children}
      </Link>
    </div>
  );
  // return (
  //   <ListItemButton
  //     onClick={onClick}
  //     sx={{
  //       pl: 4,
  //       maxWidth: 'var(--toc-drawer-width)',
  //       background: isCurrent
  //         ? 'var(--color-local-highlite-lighter4)'
  //         : 'transparent',

  //       '&:hover': {
  //         background: 'var(--color-local-highlite-lighter4)',
  //       },
  //     }}
  //     component={component}
  //     href={href}
  //   >
  //     <ListItemIcon>
  //       <Icon sx={{ fill: 'var(--color-course-menu-icon-color)' }} />
  //     </ListItemIcon>
  //     <ListItemText primary={children} />
  //   </ListItemButton>
  // );
}
