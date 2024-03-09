import { ClientOnly } from 'remix-utils/client-only';

import Home from '~/screens/Home';

export default function Courses() {
  return (
    <ClientOnly fallback={<div>loading</div>}>{() => <Home />}</ClientOnly>
  );
}
