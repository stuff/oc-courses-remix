import { useNavigation } from '@remix-run/react';

export default function useIsNavigating() {
  const { state } = useNavigation();
  return state === 'loading';
}
