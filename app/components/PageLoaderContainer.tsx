import { useEffect, useRef } from 'react';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

import useIsNavigating from '~/framework/useIsNavigating';

function Wrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<LoadingBarRef>(null);

  const isNavigating = useIsNavigating();

  useEffect(() => {
    if (ref.current) {
      if (isNavigating) {
        ref.current.continuousStart();
      } else {
        ref.current.complete();
      }
    }
  }, [isNavigating]);

  return (
    <>
      <LoadingBar
        style={{ background: 'var(--color-brand)' }}
        ref={ref}
        shadow={false}
        height={4}
      />
      {children}
    </>
  );
}

export default function PageLoaderContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Wrapper>{children}</Wrapper>;
}
