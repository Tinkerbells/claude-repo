import type { OlapReportPageType } from '../types/olapReportPage'

import { useAppSelector } from '../store/store'

// interface PageType {
//     pageId: string;

//     //filters: unknown[];
//     // другие поля...
//   }

export function usePageParams(pageId: string): OlapReportPageType {
  // const dispatch = useAppDispatch();

  const page = useAppSelector(state =>
    state.olapReportsPages.pages.find(item => item.pageId === pageId),
  )

  // const isLoading = useAppSelector((state) =>
  //   state.olapReposrtsPages.loading
  // );

  // useEffect(() => {
  //   if (!page && !isLoading) {
  //     dispatch(fetchPageById(pageId));
  //   }
  // }, [pageId, page, isLoading, dispatch]);

  // if (isLoading) {
  //   throw new Promise(() => {}); // Для Suspense
  // }

  if (!page) {
    throw new Error(`Page with id "${pageId}" not found`)
  }

  return page
}
