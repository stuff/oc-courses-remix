import { useParams } from 'next/navigation';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LoadingLink from '@/app/components/LoadingLink';
import ImgixImage from '@/app/components/ImgixImage';
import { useBurgerMenu } from '@/contexts/burgerMenuContext';

export default function TocPartItem({
  label,
  image,
}: {
  label: string;
  image: string;
}) {
  const { closeBurgerMenu } = useBurgerMenu();
  const { courseIdSlug, chapterIdSlug } = useParams();
  const isCurrent = chapterIdSlug === undefined;

  return (
    <ListItemButton
      onClick={closeBurgerMenu}
      sx={{
        maxWidth: 'var(--toc-drawer-width)',
        background: isCurrent
          ? 'var(--color-local-highlite-lighter4)'
          : 'transparent',
      }}
      component={LoadingLink}
      href={`/courses/${courseIdSlug}`}
    >
      <ImgixImage
        src={image}
        width={120}
        sx={{ borderRadius: 2, aspectRatio: '16 / 9' }}
      />
      <ListItemText sx={{ marginLeft: 2 }} primary={label} />
    </ListItemButton>
  );
}
