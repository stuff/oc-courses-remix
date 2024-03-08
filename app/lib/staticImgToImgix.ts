export default function staticImgToImgix(src: string, options = '') {
  let newSrc = src;
  if (src.match(/course\.oc-static\.com/)) {
    newSrc = src.replace(/course\.oc-static\.com/g, 'oc-course.imgix.net');
  }
  return newSrc + '?auto=compress,format&q=80&' + options;
}
