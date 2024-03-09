import staticImgToImgix from '~/lib/staticImgToImgix';

interface Props {
  src: string;
  alt?: string;
  width?: number;
}

// function imgSrcToImgix(imgSrc: string, props: any = {}) {
//   let newImgSrc = imgSrc;

//   if (imgSrc.startsWith('https://course.oc-static.com')) {
//     newImgSrc = imgSrc.replace(
//       'https://course.oc-static.com',
//       'https://oc-course.imgix.net'
//     );
//     newImgSrc += '?auto=compress,format&q=80';

//     if (props.width) {
//       newImgSrc += '&w=' + props.width;
//     }
//   }

//   return newImgSrc;
// }

export default function ImgixImage({ src, alt, width, ...props }: Props) {
  const newUrl = staticImgToImgix(src, width ? `w=${width}` : '');

  return <img src={newUrl} {...props} width={width} alt={alt ?? ''} />;
}
