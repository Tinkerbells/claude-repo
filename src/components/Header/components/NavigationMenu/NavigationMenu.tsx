import type { MenuProps } from '@tinkerbells/xenon-ui'

import { cn } from '@bem-react/classname'
import { observer } from 'mobx-react-lite'
import { memo, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconButton, Menu, Typography } from '@tinkerbells/xenon-ui'

import './navigation-menu.scss'


import { MenuModal } from '../MenuModal'
import {
  HomeOutlined,
  LogoPlaceholder,
} from '../../../../assets/Icons'

const b = cn('navigation-menu')

type MenuItem = Required<MenuProps>['items'][number]

function NavigationMenuComponent(props: MenuProps) {
  const { ...menuProps } = props
  const [current, setCurrent] = useState('main')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()


  // Get open OLAP report pages from the store
  // This assumes we've added a pageManager to our RootStore


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

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // Memoized items to avoid recreation on each render
  const items = useMemo<MenuItem[]>(() => {
    return [
      {
        icon: <LogoPlaceholder />,
        key: 'logo',
      },
      {
        label: <Link to="/">Главная</Link>,
        icon: <HomeOutlined />,
        key: 'main',
      },
    ]
  }, [])

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
      {isModalOpen && (
        <MenuModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          pageId={current}
        />
      )}
    </>
  )
}

// Add observer here to make the component react to MobX state changes
export const NavigationMenu = memo(observer(NavigationMenuComponent))
