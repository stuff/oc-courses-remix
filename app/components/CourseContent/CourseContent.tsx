import 'highlight.js/styles/atom-one-dark.css';

import styles from './styles.module.css';

export default function CourseContent({ children }: { children: string }) {
  return (
    <div
      className={styles.root}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
