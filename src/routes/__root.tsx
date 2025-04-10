import React from 'react'
import { observer } from 'mobx-react-lite'
import { Layout, ThemeProvider } from '@tinkerbells/xenon-ui'
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { MenuHeader } from '../components/Header/MenuHeader'

const RootComponent = observer(() => {
  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="light">
        <Layout>
          <Layout.Content>
            <MenuHeader />
            <Outlet />
          </Layout.Content>
        </Layout>
      </ThemeProvider>
    </React.Fragment>
  )
})

export default RootComponent

export const Route = createRootRoute({
  component: RootComponent,
})
