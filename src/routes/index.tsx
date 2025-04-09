import { createFileRoute } from '@tanstack/react-router'

import { MainPage } from '../components/Pages/MainPage/MainPage'

export const Route = createFileRoute('/')({
  component: MainPage,
})
