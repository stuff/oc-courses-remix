import { ComponentProps } from 'react';
import type { IconType } from 'react-icons';

import styles from './styles.module.css';

interface Props<T extends React.ElementType> {
  children: React.ReactNode;
  component?: T;
  icon?: IconType;
}

export default function Button<T extends React.ElementType>({
  children,
  component: Component = 'button',
  icon: Icon,
  ...props
}: Props<T> & ComponentProps<T>) {
  return (
    <Component className={styles.root} {...props}>
      {children} {Icon && <Icon size="1.5rem" />}
    </Component>
  );
}
