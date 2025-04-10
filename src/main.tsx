import React from 'react'
import ReactDOM from 'react-dom/client'
import { MobxQueryClient } from 'mobx-tanstack-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { hashKey, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import './styles/index.scss'
import './styles/reset.scss'

import '@tinkerbells/xenon-ui/styles.css'

import { routeTree } from './routeTree.gen'

const MAX_FAILURE_COUNT = 3

export const queryClient = new MobxQueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      queryKeyHashFn: hashKey,
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
      staleTime: 5 * 60 * 1000, // 5 mins
      retry: (failureCount, error) => {
        if ('status' in error && Number(error.status) >= 500) {
          return MAX_FAILURE_COUNT - failureCount > 0
        }
        return false
      },
    },
    mutations: {
      throwOnError: true,
    },
  },
})

// Create the router
const router = createRouter({
  routeTree,
  defaultStaleTime: Infinity,
  basepath: '/OLAP_frnt',
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
