import { Layout, ThemeProvider } from '@tinkerbells/xenon-ui'

import { MainPage } from './components/Pages/MainPage/MainPage'

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Layout>
        <Layout.Content>
          <MainPage />
        </Layout.Content>
      </Layout>
    </ThemeProvider>
  )
}
