import { ThemePicker } from '@tinkerbells/xenon-ui'

import { NavigationMenu } from './components/NavigationMenu/NavigationMenu'
import './menu-header.scss'

export function MenuHeader() {
  return (
    <header className="menu-header">
      <NavigationMenu />
      <ThemePicker />
    </header>
  )
}
