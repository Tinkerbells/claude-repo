import { ThemePicker } from '@tinkerbells/xenon-ui'

import { NavigationMenu } from './components/NavigationMenu/NavigationMenu'
import './MenuHeader.styles.scss'

export function MenuHeader() {
  return (
    <header className="menu-header">
      <NavigationMenu />
      <ThemePicker />
    </header>
  )
}
