import { useEffect, useState } from 'react';
import { useStore } from '../store';

/** Gọi lại truy vấn mỗi khi sang tháng mới. */
export function useQuery<T>(make: () => Promise<T>, deps: unknown[]): { data?: T; error?: string } {
  const tick = useStore((s) => s.tick?.tick ?? 0);
  const [state, setState] = useState<{ data?: T; error?: string }>({});
  useEffect(() => {
    let live = true;
    make()
      .then((data) => live && setState({ data }))
      .catch((e: Error) => live && setState({ error: e.message }));
    return () => {
      live = false;
    };
  }, [tick, ...deps]);
  return state;
}
