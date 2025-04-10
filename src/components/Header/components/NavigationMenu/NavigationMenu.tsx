import type { MenuProps } from '@tinkerbells/xenon-ui'

import { cn } from '@bem-react/classname'
import { observer } from 'mobx-react-lite'
import { Button, Menu } from '@tinkerbells/xenon-ui'
import { Link, useNavigate } from '@tanstack/react-router'
import { memo, useCallback, useMemo, useState } from 'react'

import './navigation-menu.scss'

// Импортируем PageManager
import { PageManager } from '@/controllers/PageManagerStore'

import { MenuModal } from '../MenuModal'
import {
  CloseButton,
  HomeOutlined,
  LogoPlaceholder,
} from '../../../../assets/Icons'

const b = cn('navigation-menu')

type MenuItem = Required<MenuProps>['items'][number]

function NavigationMenuComponent(props: MenuProps) {
  const { ...menuProps } = props
  const [current, setCurrent] = useState('main')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pageToClose, setPageToClose] = useState<string | null>(null)
  const navigate = useNavigate()

  // Получаем открытые страницы из PageManager
  const { openPages } = PageManager

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key !== 'logo') {
      setCurrent(e.key)
    }

    if (e.key === 'main') {
      navigate({ to: '/' })
    }
    else {
      const keyId = e.key
      navigate({
        to: '/olapReport/$pageId',
        params: { pageId: keyId },
      })
    }
  }

  // Обработчик закрытия страницы
  const handleClosePage = useCallback((pageId: string, event: React.MouseEvent) => {
    // Останавливаем распространение события, чтобы не срабатывал onClick меню
    event.stopPropagation()

    // Запоминаем страницу, которую пытаемся закрыть
    setPageToClose(pageId)

    // Показываем модальное окно подтверждения
    setIsModalOpen(true)
  }, [])

  // Обработчик подтверждения закрытия страницы
  const handleConfirmClose = useCallback(() => {
    if (pageToClose) {
      // Если закрываем текущую страницу, то возвращаемся на главную
      if (current === pageToClose) {
        navigate({ to: '/' })
        setCurrent('main')
      }

      // Удаляем страницу из PageManager
      PageManager.removePage(pageToClose)

      // Сбрасываем pageToClose
      setPageToClose(null)
    }

    // Закрываем модальное окно
    setIsModalOpen(false)
  }, [current, navigate, pageToClose])

  // Обработчик отмены закрытия страницы
  const handleCancelClose = useCallback(() => {
    setPageToClose(null)
    setIsModalOpen(false)
  }, [])

  // Динамически генерируем пункты меню на основе открытых страниц
  const items = useMemo<MenuItem[]>(() => {
    const baseItems: MenuItem[] = [
      {
        icon: <LogoPlaceholder />,
        key: 'logo',
      },
      {
        label: (
          <div className={b('item')}>
            <Link to="/">Главная</Link>
          </div>
        ),
        icon: <HomeOutlined />,
        key: 'main',
      },
    ]

    // Добавляем открытые страницы
    const pageItems: MenuItem[] = openPages.map(page => ({
      key: page.pageId,
      label: (
        <div className={b('item')}>
          <span>{page.versionName || `Отчет ${page.pageId.slice(0, 6)}`}</span>
          <Button
            variant="ghost"
            size="sm"
            className={b('item--close-button')}
            onClick={e => handleClosePage(page.pageId, e)}
          >
            <CloseButton />
          </Button>
        </div>
      ),
    }))

    return [...baseItems, ...pageItems]
  }, [openPages, handleClosePage])

  return (
    <>
      <Menu
        className={b({ mode: menuProps.mode })}
        onClick={onClick}
        mode="horizontal"
        selectedKeys={[current]}
        items={items}
        {...menuProps}
      />
      {isModalOpen && pageToClose && (
        <MenuModal
          isModalOpen={isModalOpen}
          handleOk={handleConfirmClose}
          handleCancel={handleCancelClose}
          pageId={pageToClose}
        />
      )}
    </>
  )
}

// Add observer here to make the component react to MobX state changes
export const NavigationMenu = memo(observer(NavigationMenuComponent))
