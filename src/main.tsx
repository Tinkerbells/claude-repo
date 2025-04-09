import React from 'react'
import { Provider } from 'react-redux'

import './styles/index.scss'
import './styles/reset.scss'

import '@tinkerbells/xenon-ui/styles.css'
import ReactDOM from 'react-dom/client'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { PersistGate } from 'redux-persist/integration/react'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { persistor, store } from './store/store'

const router = createRouter({
  routeTree,
  defaultStaleTime: Infinity, // сомнительно
  basepath: '/OLAP_frnt',
  defaultPreload: 'intent',
  scrollRestoration: true,
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
    <NuqsAdapter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </NuqsAdapter>
  </React.StrictMode>,
)
